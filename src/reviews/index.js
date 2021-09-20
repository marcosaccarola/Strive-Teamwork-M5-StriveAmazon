import express from 'express'
import {fileURLToPath} from 'url'
import path,{dirname} from 'path'
import fs from 'fs'
import uniqid from 'uniqid'
//import { send } from 'process'

const _FILENAME=fileURLToPath(import.meta.url)
const _DIRNAME=dirname(_FILENAME)
const reviewsJSONFILEPath=path.join(_DIRNAME,'reviews.json')

const router=express.Router()

// GET ALL REVIEWS
router.get('/',async(req,res,next)=>{
    try {
        const buffer=fs.readFileSync(reviewsJSONFILEPath)
        const string=buffer.toString()
        const array=JSON.parse(string)
        res.send(array)
    } catch (error) {
        res.status(500).send({message:error.message})
    }
})
// POST A REVIEW by product ID
router.post('/:id',async(req,res,next)=>{
    try {        
        const buffer=fs.readFileSync(reviewsJSONFILEPath)
        const string=buffer.toString()
        const array=JSON.parse(string)
        const{comment,rate}=req.body
        const review={
            _id:uniqid(),
            comment,rate,
            productId:req.params.id,
            createdAt:new Date()
        }
        array.push(review)
        fs.writeFileSync(reviewsJSONFILEPath,JSON.stringify(array))
        res.send(review)
    } catch (error) {
        res.status(500).send({message:error.message})
    }   
})
// UPDATE A REVIEW by review ID
router.put('/:id',async(req,res,next)=>{
    try {
        const buffer=fs.readFileSync(reviewsJSONFILEPath)
        const string=buffer.toString()
        const array=JSON.parse(string)
        const oldReviewIndex=array.findIndex(r=>r.id===req.params.id)
        if(oldReviewIndex==-1){message:`REVIEW WITH ID ${req.params.id} DOES NOT EXIST`}
        const oldReview=array[oldReviewIndex]
        const updatedReview={...oldReview,...req.body,upDatedAt:new Date(),id:req.params.id}
        array[oldReviewIndex]=updatedReview
        fs.writeFileSync(reviewsJSONFILEPath,JSON.stringify(array))
        res.send(updatedReview)
    } catch (error) {
        res.status(500).send({message:error.message})
    }
})

export default router