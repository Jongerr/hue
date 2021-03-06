const knex = require('./index');

const user = (name) => {
  return knex('users').where({name: name})
}

const entries = () => {
  return knex('entries')
  .join('users', 'entries.userid', '=', 'users.id')
  .select('entries.id', 'entries.url', 'entries.title', 'entries.text', 'entries.created_at', 'users.name')
  .orderBy('entries.created_at', 'desc');
}

const entry = (entryid) => {
  return knex('entries')
  .where({'entries.id': entryid})
  .join('users', 'entries.userid', '=', 'users.id')
  .select('entries.id', 'entries.url', 'entries.title', 'entries.text', 'entries.created_at', 'users.name');
}

const comments = (entryid) => {
  return knex('comments')
  .where({entryid: entryid})
  .join('users', 'comments.userid', '=', 'users.id')
  .select('comments.id', 'comments.text', 'comments.created_at', 'users.name')
  .orderBy('comments.created_at', 'desc');
}

const entriesByUser = name => {
  let userid = knex('users').where({name: name}).select('id');
  return knex('entries')
  .where({userid: userid})
  .join('users', 'entries.userid', '=', 'users.id')
  .select('entries.id', 'entries.url', 'entries.title', 'entries.text', 'entries.created_at', 'users.name');  
}

const commentsByUser = (name) => {
  let userid = knex('users').where({name: name}).select('id');
  return knex('comments')
  .where({userid: userid})
  .join('users', 'comments.userid', '=', 'users.id')
  .select('comments.id', 'comments.text', 'comments.created_at', 'comments.entryid', 'users.name');
}

const searchByTitle = (title) => {
  return knex('entries')
  .whereRaw('title like ?', [`%${title}%`])
  .join('users', 'entries.userid', '=', 'users.id');
}

const getMessagesByRecipient = (user) => {
  let rec_id = knex('users').where({name: user}).select('id');
  return knex('inbox')
  .where({rec_id: rec_id})
  .join('users', 'send_id', '=', 'users.id')
  .select('inbox.id', 'inbox.send_id', 'inbox.rec_id', 'users.name', 'inbox.text', 'inbox.subject', 'inbox.created_at');
}

const getMessagesBySender = user => {
  let send_id = knex('users').where({name: user}).select('id')
  return knex('inbox')
  .where({send_id: send_id})
  .join('users', 'rec_id', '=', 'users.id')
  .select('inbox.id', 'inbox.send_id', 'inbox.rec_id', 'users.name', 'inbox.text', 'inbox.subject', 'inbox.created_at');
}

const searchByUser = (user) => {
  return knex('users')
  .whereRaw('name like ?', [`%${user}%`]);
}

const getLikedEntries = (name) => {
  return knex('entries_votes')
  .where({'entries_votes.userid': name, 'entries_votes.voted': 'upvote'})
  .join('entries', 'entries_votes.entryid', '=', 'entries.id')
  .join('users', 'users.id', '=', 'entries.userid')
  .select('entries.*', 'users.name')
}

const getLikedComments = (name) => {
  return knex('comments_votes')
  .where({ 'comments_votes.userid': name, 'comments_votes.voted': 'upvote' })
  .join('comments', 'comments_votes.commentid', '=', 'comments.id')
  .join('users', 'users.id', '=', 'comments.userid')
  .select('comments.*', 'users.name')
}

const getUserByEmail = (email) => {
  return knex('users')
    .where({ 'email': email })
    .select('name')
}

/************************************************************/
// Prestige (karma) queries
/************************************************************/

const getEntryVotes = (entryid) => {
  return knex('entries')
  .where({'entries.id': entryid})
  .select('entries.up_votes', 'entries.down_votes');
}

const getCommentVotes = (commentid) => {
  return knex('comments')
  .where({'comments.id': commentid})
  .select('comments.up_votes', 'comments.down_votes', 'comments.text', 'comments.id')
}

const checkEntryVote = (userid, entryid) => {
  return knex('entries_votes')
  .where({userid: userid, entryid: entryid})
  .select('entries_votes.voted', 'entries_votes.id')
}

const checkCommentVote = (userid, commentid) => {
  return knex('comments_votes')
  .where({userid: userid, commentid: commentid})
  .select('comments_votes.voted', 'comments_votes.id')
}

/************************************************************/
/************************************************************/

module.exports = {
  user,
  entries,
  entry,
  comments,
  entriesByUser,
  commentsByUser,
  getEntryVotes,
  getCommentVotes,
  checkEntryVote,
  checkCommentVote,
  searchByTitle,
  searchByUser,
  getLikedEntries,
  getLikedComments,
  getMessagesByRecipient,
  getUserByEmail,
  getMessagesBySender
};
