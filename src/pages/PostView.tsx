import React, { useEffect, useState } from 'react';
import {
    IonAvatar,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonContent,
    IonLabel,
    IonPage,
    IonSkeletonText,
    IonTextarea,
} from '@ionic/react';
import './PostView.scss';
import PostComments from '../components/PostComments';
import CommentCompose from '../components/CommentCompose';
import Post from '../Models/Post';
import FireStoreDB from '../Models/firestore';
import { useParams } from 'react-router-dom';
import Comment from '../Models/Comment';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/User/UserStore';

const PostView: React.FC = () => {
    const [post, setPost] = useState<Post>();
    const [comments, setComments] = useState<{ id: string; comment: Comment }[]>();
    const db = new FireStoreDB();
    const user = useSelector(selectUser);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        console.log('Adding event listeners...');
        const unSubscribeFromPosts = db.db
            .collection('posts')
            .withConverter(Post)
            .doc(id)
            .onSnapshot({
                next: (snapshot) => {
                    console.log('Fetched Post');
                    const doc = snapshot.data() as Post;
                    setPost(doc);
                },
            });
        const unSubscribeFromComments = db.db
            .collection('comments')
            .where('replyTo', '==', id)
            .orderBy('timestamp', 'desc')
            .withConverter(Comment)
            .onSnapshot({
                next: (snapshot) => {
                    console.log('Fetched Comments');

                    const commentDocs = snapshot.docs;
                    const Comments = commentDocs.map((e) => {
                        const comment = e.data();
                        return {
                            id: e.id,
                            comment: comment,
                        };
                    });
                    setComments(Comments);
                    console.log(Comments);
                },
            });
        return () => {
            unSubscribeFromPosts();
            unSubscribeFromComments();
            console.log('Unsubscribed...');
        };
    }, []);
    return (
        <IonPage>
            <IonContent>
                <IonCard className="singlePost wrapper">
                    <IonCardHeader className="postInfo">
                        <IonAvatar className="postAvatar"></IonAvatar>
                        {post ? (
                            <IonCardTitle className="postName">{post.title}</IonCardTitle>
                        ) : (
                            <IonSkeletonText animated />
                        )}
                        {post ? (
                            <IonCardSubtitle className="postDescription">
                                University of Calgary - {post.getTimePosted()}
                            </IonCardSubtitle>
                        ) : (
                            <IonSkeletonText animated />
                        )}
                    </IonCardHeader>
                    <IonCardContent>
                        <IonChip className="subjectChip">
                            {post ? <IonLabel>{post.category}</IonLabel> : <IonSkeletonText animated />}
                        </IonChip>
                        {post ? (
                            <IonTextarea auto-grow="true" value={post.content}></IonTextarea>
                        ) : (
                            <IonSkeletonText animated />
                        )}
                    </IonCardContent>
                </IonCard>
                <PostComments comments={comments}> </PostComments>
                {user && <CommentCompose user={user} postId={id} />}
                <IonButton>Submit</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default PostView;
