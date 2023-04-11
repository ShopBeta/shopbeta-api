const express = require('express')
const { Feed, Video } = require('../models/feed')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

// FEED ROUTERS

 // upload media file for a feed
 const imageUpload = multer({
    limits: {
        fileSize: 100000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/)) {
            return cb(new Error('Please upload a supported file format'))
        }

        cb(undefined, true)
    }
})

router.post('/feed/:id', imageUpload.single('media'), async (req, res) => {
    const feed = new Feed({
        ...req.body,
        owner: req.params.id
    })
    console.log(feed)

    try {
        const buffer = await sharp(req.file.buffer).png().toBuffer()
        feed.media = buffer 

        await feed.save()
        res.redirect('https://shopbeta-online.onrender.com/assets/Adbillboard')
        // res.status(201).send(feed)
    } catch (e) {
        res.status(400).send(e)
    }
    
 }, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

 router.get('/feed', async (req, res) => {
    try {
        const feed = await Feed.find({})
        res.send(feed.reverse())
    } catch (e) {
        res.status(500).send(e)
    }
 })

 router.get('/feed/:id/media', async (req, res) => {
    try {
        const feed = await Feed.findById(req.params.id)
       
        if (!feed || !feed.media) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(feed.media)
    } catch (e) {
        res.status(404).send()
    }
})

// GET /feed?completed=true
// GET /feed?limit=10&skip=20
// GET /feed?sortBy=createdAt:desc
router.get('/feed', auth, async (req, res) => {
    const match = {}

    if (req.query.user.follow) {
        match.follow = req.query.user.follow === 'true'
    }

    try {
        await req.feed.populate({
            path: 'feed',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
            }
        }).execPopulate()
        res.send(req.feed)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/feed/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const feed = await Feed.findById(_id)

        if (!feed) {
            return res.status(404).send()
        }

        res.send(feed)
    } catch (e) {
        res.status(500).send()
    }

})

router.delete('/feed/:id', auth, async (req, res) => {
    try {
        const feed = await Feed.findByIdAndDelete(req.params.id)

        if (!feed) {
            res.status(404).send()
        }

        res.send(feed)
    } catch (e) {
        res.status(500).send(e)
    }
})

//  upload media file as a comment
const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
            return cb(new Error('Please upload a supported file format'))
        }

        cb(undefined, true)
    }
})

// post comments
router.post('/feed/:id/comments', auth, upload.single('file'), async (req, res) => {
   
    const feedModel = Feed.findById({
        ...req.body,
        _id: req.params.id,
    })

    try {
        const feed = await feedModel

        if (!feed) {
            return res.status(404).send()
        }
        const updates = req.body
        // feed.comments[0].file = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()  
        // feed.comments.push(feed.comments[0])
        feed.comments.push(updates)
        
        await feed.save()
        res.status(201).send(feed)
    } catch (e) {
        res.status(400).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/feed/:id/comments', async (req, res) => {
    try {
        const feed = await Feed.findById(req.params.id)

        if (!feed || !feed.comments) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(feed.comments)
    } catch (e) {
        res.status(404).send()
    }
})

// post hearts
router.post('/feed/:id/hearts', auth, async (req, res) => {
   
    const feedModel = Feed.findById({
        ...req.body,
        _id: req.params.id,
    })

    try {
        const feed = await feedModel

        if (!feed) {
            return res.status(404).send()
        }
        const updates = req.body.hearts
        feed.hearts = updates
        await feed.save()
        res.status(201).send(feed)
    } catch (e) {
        res.status(400).send(e)
    }
})


// VIDEO ROUTERS

const videoUpload = multer({
     limits: {
        fileSize: 20000000 // 10000000 Bytes = 10 MB
     },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
            return cb(new Error('Please upload a video supported file format'))
        }

        cb(undefined, true)
    }
})

router.post('/video/:id', videoUpload.single('video'), async (req, res) => {
    const video = new Video({
        ...req.body,
        owner: req.params.id
    })
    console.log(video)

    try {
        const buffer = await req.file.buffer
        video.video = buffer 

        await video.save()
        res.redirect('https://shopbeta-online.onrender.com/assets/VideoSpace')
        // res.send(video)
    } catch (e) {
        res.status(400).send(e)
    }
    
 }, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/video', async (req, res) => {
    try {
        const video = await Video.find({})
        res.send(video.reverse())
    } catch (e) {
        res.status(500).send(e)
    }
})

 router.get('/video/:id/video', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
       
        if (!video || !video.video) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(video.video)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/video/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const video = await Video.findById(_id)

        if (!video) {
            return res.status(404).send()
        }

        res.send(video)
    } catch (e) {
       res.status(500).send()
    }

})

router.delete('/video/:id', auth, async (req, res) => {
   try {
       const video = await Video.findByIdAndDelete(req.params.id)

       if (!video) {
           res.status(404).send()
       }

       res.send(video)
   } catch (e) {
       res.status(500).send(e)
   }
})

// post comments
router.post('/video/:id/comments', auth, async (req, res) => {
  
   const videoModel = Video.findById({
       ...req.body,
       _id: req.params.id,
   })

   try {
       const video = await videoModel

       if (!video) {
           return res.status(404).send()
       }
       const updates = req.body
       video.comments.push(updates)
       
       await video.save()
       res.status(201).send(video)
   } catch (e) {
       res.status(400).send(e)
   }
}, (error, req, res, next) => {
   res.status(400).send({ error: error.message })
})

router.get('/video/:id/comments', async (req, res) => {
   try {
       const video = await Video.findById(req.params.id)

       if (!video || !video.comments) {
           throw new Error()
       }

       res.set('Content-Type', 'image/jpg')
       res.send(video.comments)
   } catch (e) {
       res.status(404).send()
   }
})

// post hearts
router.post('/video/:id/hearts', auth, async (req, res) => {
  
   const videoModel = Video.findById({
       ...req.body,
       _id: req.params.id,
   })

   try {
       const video = await videoModel

       if (!video) {
           return res.status(404).send()
       }
       const updates = req.body.hearts
       video.hearts = updates
       await video.save()
       res.status(201).send(video)
   } catch (e) {
       res.status(400).send(e)
   }
})

 
module.exports = router