\c nc_news_test;
 select articles.*, count(comments.comment_id) as comment_count
 from articles
 left join comments
 on comments.article_id = articles.article_id
 where topic = 'mitch'
 group by articles.article_id
 order by article_id DEsc;

 select * from users;
