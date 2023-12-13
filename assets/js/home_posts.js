{
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                sucess: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($('.delete-post-button', newPost));
                }, error: function (error) {
                    console.log(error)
                    console.log(error.reponseText);
                }
            })
        });
    }

    //method to create a post in DOM

    let newPostDom = function (post) {
        return$(`<li id="post-${post._id}">
                <p>     
                        
                        <small>
                            <a  href="/posts/destroy/${post._id}">XD</a>    
                        </small>
                        ${post.content}
                                <br>
                        <small>
                        ${post.user.name}
                        </small>
                        <br>
                        <small>
                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                0 Likes
                        </a>
                        </small>
                        </p>
                        <div class="post-comments">
                                <% if(locals.user){ }
                                    <form action="/comments/create" method="POST">
                                                <input type=" text" name="content" placeholder="Type here to add comment..." required>
                                                <input type="hidden" name="post" value="${post._id}">
                                                <input type="submit" value="Add Coment">
                                        </form>
                                        
                                <% } }

                                <div class ="post-comments-list">
                                        <ul id="post-comments-${post._id}">
                                                <% for (comment of post.comments){}

                                                        <%- include('_comment') -}
                                                        

                                                <%} }
                                        </ul>
                                </div>
                        </div>
                    </li>`)
    }
    // method to delete a post from DOM
    let deletePost = function (deletelink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.post_id}`).remove();
                }, error: function (error) {
                    console.log(error.reponseText);

                }
            })
        })
    }




    createPost();
}