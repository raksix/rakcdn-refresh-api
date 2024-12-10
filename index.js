const express = require('express')
const { name, id } = require('./config')
const app = express()
const cors = require('cors');
const { default: axios } = require('axios');
const { WebhookClient, AttachmentBuilder } = require('discord.js');


app.use(express.urlencoded({ extended: true, limit: '100000mb' }));
app.use(cors())

var heat = 0 // yük değeri

app.get('/', function (req, res) {
   return res.json({
      name: name,
      id,
      heat
   })
})

const sleep = (ms) => new Promise((resolve) => {
   setTimeout(() => { resolve() }, ms)
})

app.post('/refresh', async (req, res) => {
   const {
      url,
      token,
      cookie,
      endpoint
   } = req.body;

   heat += 1

   var start = false

   while (!start) {
      start = true

      let data = JSON.stringify({
         "attachment_urls": [
            `${url}`
         ]
      });

      const config = {
         method: 'post',
         maxBodyLength: Infinity,
         url: 'https://discord.com/api/v9/' + endpoint,
         headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json',
            'Cookie': cookie
         },
         data: data
      }

      const dc_res = await axios.request(config).catch(async (err) => {
         //console.log(err)
         await sleep(5000)
         start = false
      })

      if (!dc_res) return;

      var new_url = dc_res.data?.refreshed_urls[0]?.refreshed

      heat -= 1

      return res.json({
         message: 'Media file successfully refreshed',
         url: new_url
      })
   }
})


const wait_func = () => new Promise(async (resolve) => {
   await sleep(30000)
   resolve()
})

app.post('/upload', async (req, res) => {
   const {
      webhook,
      imagesdata,
      video
   } = req.body;

   if(!webhook || !imagesdata) return res.json({
      error: true,
      message: 'Hepsini gir la'
   })

   const mangaClient = new WebhookClient({ url: webhook });

   buffer_images = imagesdata.split(',')

   console.log(buffer_images)
   
   const images = []

   buffer_images.map(a => {
      if (!images.includes(a)) {
         images.push(a)
      }
   })


   try {
      const upload_all_images = () => new Promise(async (resolve) => {
         var index = 0
         var n_index = -1

         var waits = [1]
         const dc_images = []



         setInterval(async () => {
            if (index === n_index) return
            if (dc_images.length === images.length) return resolve(dc_images)

            if (String(index).slice(1, 2) === 0) await wait_func()

            n_index = index;

            const a = images[index]

            if (!a) return resolve(dc_images)

            let atc = new AttachmentBuilder();



            atc.setFile(a)
            video ? atc.setName('video.ts') : null

            mangaClient.send({
               files: video ? [atc] : [{
                  attachment: a,
               }],
               username: "Turkmanga",
            }).then(async (message) => {
               if (!message.attachments[0]?.proxy_url) return index -= 1
               dc_images.push(message.attachments[0].proxy_url)
               index += 1
               console.log(`${index}/${images.length}`)
            }).catch(err => {
               //console.log(err)
               index -= 1
            })
         })
      })

      upload_all_images().then(images => {
         return res.json({
            error: false,
            images
         })
      })
   } catch (error) {
      return res.json({
         error: true,
         message: 'Resimler uplaodlanırken hata oluştu!'
      })
   } 
})


/*


   "engines": {
      "node": "16.x"
   }


   mangaClient.send({
      files: [{
         attachment: buffer
      }],
      username: "Turkmanga",
   }).then(async (message) => {

      if (!message.attachments[0]?.proxy_url) return index -= 1
      dc_images.push(message.attachments[0].proxy_url)
      index += 1

      return res.json({
         error: false,
         image: message.attachments[0]?.proxy_url
      })
      console.log(`${index}/${images.length}`)
   }).catch(err => {
      console.log(err)
      return res.json({
         error: true,
         message: 'Resim yüklenmedi!'
      })
   })


*/

setInterval(() => {
   heat = 0 // arada bug olduğu için 10 dakikada bir yükü sıfırlıyor!
}, 10 * 60 * 1000)

app.listen(process.env.PORT || 7776)