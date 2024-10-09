const express = require('express')
const { name, id } = require('./config')
const app = express()
const cors = require('cors');
const { default: axios } = require('axios');


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

app.post('/refresh', async (req, res) => {
   const {
      url,
      token,
      cookie,
      endpoint
   } = req.body;

   heat += 1

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
      console.log(err)
      await sleep(1000)
      start = false
   })

   if (!dc_res) return;

   var new_url = dc_res.data?.refreshed_urls[0]?.refreshed

   heat -= 1

   return res.json({
      message: 'Media file successfully refreshed',
      url: new_url
   })
})

setInterval(() => {
   heat = 0 // arada bug olduğu için 10 dakikada bir yükü sıfırlıyor!
}, 10 * 60 * 1000)

app.listen(process.env.PORT || 7776)