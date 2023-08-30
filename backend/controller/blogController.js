import Joi from "joi";
import fs from "fs";
import Blog from "../models/blog.js";
import { BACKEND_SERVER_PATH } from "../config/index.js";
import Comment from "../models/comments.js";
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const blogController = {
  //create blog
  async createBlog(req, res, next) {
    //validate user input
    const blogCreateSchema = Joi.object({
      content: Joi.string().required(),
      title: Joi.string().required(),
      photopath: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = blogCreateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author } = req.body;
    //read photo in the buffer
    const buffer = Buffer.from(
      photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    //allot randoms name to the photo
    const imagePath = `${Date.now()}-${author}.png`;
    //store locally
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }
    //save to database
    let blog;
    try {
      const blogToStore = new Blog({
        content,
        title,
        author,
        photopath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });
      blog = await blogToStore.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ blog: blog });
  },

  //get all blogs
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({});
      const blogArr = [];
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        blogArr.push(blog);
      }
      return res.status(200).json({ blogs: blogArr });
    } catch (error) {
      return next(error);
    }
  },
  //get blog by id
  async getBlogById(req, res, next) {
    const getBlogIdSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = getBlogIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let blog;
    try {
      blog = await Blog.findOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ blog: blog });
  },
  //update blog method
  async updateBlog(req, res, next) {
    const updateBlogSchema = Joi.object({
      content: Joi.string(),
      title: Joi.string(),
      photopath: Joi.string(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blogId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = updateBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, blogId, author } = req.body;
    let blog;
    try {
      blog = await Blog.findOne({ _id: blogId });
    } catch (error) {
      return next(error);
    }
    //delete previous photo
    try {
      if (photopath) {
        let previous = blog.photopath;
        previous = previous.split("/").at(-1);
        fs.unlinkSync(`storage/${previous}`);
        //read photo in the buffer
        const buffer = Buffer.from(
          photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
        //allot randoms name to the photo
        const imagePath = `${Date.now()}-${author}.png`;
        //store locally
        try {
          fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
          return next(error);
        }
        //update data base
        try {
          await Blog.updateOne({
            content,
            title,
            photopath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
          });
        } catch (error) {
          return next(error);
        }
      } else {
        await Blog.updateOne({ content, title });
      }
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "blog has been updated!!!" });
  },

  //delete blog method
  async delete(req, res, next) {
    const deleteBlogSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = deleteBlogSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Blog.deleteOne({ _id: id });
      await Comment.deleteMany({});
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "blog has been deleted!!!" });
  },
};
export default blogController;
