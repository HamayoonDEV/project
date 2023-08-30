import Joi from "joi";
import Comment from "../models/comments.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const commentController = {
  //create comments
  async createComment(req, res, next) {
    const commentCreateSchema = Joi.object({
      content: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blog: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = commentCreateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, author, blog } = req.body;
    let comment;
    try {
      const newComment = new Comment({
        content,
        author,
        blog,
      });
      comment = await newComment.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ comment });
  },
  //get comments by blog id method
  async getCommentsByBlogId(req, res, next) {
    const getCommentsSchema = Joi.object({
      blogId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = getCommentsSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { blogId } = req.params;
    try {
      const comments = await Comment.find({});
      const commentArr = [];
      for (let i = 0; i < comments.length; i++) {
        const commentData = comments[i];
        commentArr.push(commentData);
      }
      return res.status(200).json({ commentArr });
    } catch (error) {
      return next(error);
    }
  },
  //delete comment method

  async deleteComment(req, res, next) {
    const deleteCommentSchema = Joi.object({
      id: Joi.string().required(),
    });
    const { error } = deleteCommentSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Comment.deleteOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "comment has been deleted!!!" });
  },
};

export default commentController;
