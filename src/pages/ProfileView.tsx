import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonImg, IonItem, IonText, IonButton, IonTitle } from '@ionic/react';
import './ProfileView.scss';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectUser } from '../features/User/UserStore';
import Post from '../Models/Post';
import PostContainer from '../components/PostContainer';
import { db } from '../Models/firebase';
import PrimaryUser from '../Models/PrimaryUser';
import User from '../Models/User';

const ProfileView: React.FC = () => {
    const [user, setUser] = useState<User | PrimaryUser | undefined>();

    const { uid } = useParams<{ uid: string }>();
    const [userPosts, setUserPosts] = useState<Post[] | undefined>();
    const [isPrimaryUser, setIsPrimaryUser] = useState<boolean | undefined>();

    async function setUserBasedOnType(isPrimaryUser: boolean) {
        if (isPrimaryUser) {
            const user = useSelector(selectUser);
            setUser(user);
        } else {
            const user = (await db.db.collection('users').doc(uid).withConverter(User).get()).data();
            setUser(user);
        }
    }

    useEffect(() => {
        const isPrimaryUser = (user?.uid ?? '') == uid;
        setIsPrimaryUser(isPrimaryUser);
        setUserBasedOnType(isPrimaryUser);

        const userPostsQueryListener = db.db
            .collection('posts')
            .where('uid', '==', uid)
            .withConverter(Post)
            .onSnapshot({
                next: (snapshot) => {
                    setUserPosts(snapshot.docs.map((e) => e.data()));
                },
                error: (e) => {
                    console.log(e);
                },
            });
        return () => {
            userPostsQueryListener();
        };
    }, []);
    return (
        <IonPage>
            <IonContent fullscreen>
                <IonItem className="wrapper">
                    <IonTitle>Profile</IonTitle>
                </IonItem>
                <IonImg className="videoPlaceholder" src="https://essucalgary.com/images/ess-logo.png" />
                <IonTitle>{user?.fullName ?? ''}</IonTitle>
                <div className="multiline">{user?.bio ?? ''}</div>
                {!isPrimaryUser && <IonButton className="follow">Follow</IonButton>}
                <IonItem>Previous Posts:</IonItem>
                <IonContent>{userPosts && userPosts.map((e, k) => <PostContainer key={k} postData={e} />)}</IonContent>
                <IonText>[LOGO] SchulichHub</IonText>
                <IonItem className="footer ion-margin" color="secondary" />
                <IonText className="bottomOfPage">© ESS Schulich School of Engineering U of C, 2020</IonText>
            </IonContent>
        </IonPage>
    );
};

export default ProfileView;
