
const { WebhookClient, MessageAttachment, AttachmentBuilder } = require('discord.js');
const { UPLOADER_WEBHOOK } = require('../../config');
const sleep = require('../extras/sleep');


const wait_func = () => new Promise(async (resolve) => {
   await sleep(30000)
   resolve()
})

const dc_upload = async (image, webhook) => new Promise(async (resolve) => {

   const mangaClient = new WebhookClient({ url: webhook });


   try {
      const a = image
      let atc = new AttachmentBuilder();


      atc.setFile(a)
      atc.setName('video.ts')


      mangaClient.send({
         files: video ? [atc] : [{
            attachment: a,
         }],
         username: "Turkmanga",
      }).then(async (message) => {
         if (!message.attachments[0]?.proxy_url) return index -= 1
         resolve(message.attachments[0].proxy_url)
      }).catch(err => {
         resolve(false)
         console.log(err)
      })

   } catch (error) {
      resolve(false)
      console.log(error)
   }

})


module.exports = dc_upload




