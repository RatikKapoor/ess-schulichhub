import React, { useState } from 'react';
import { IonList, IonItem, IonLabel, IonListHeader, IonButton, IonInput } from '@ionic/react';
import FireStoreDB from '../Models/firestore';
import app from '../Models/firebase';
import { PostDoc } from '../Models/DocTypes';
import { InputChangeEventDetail } from '@ionic/core';
import firebase from 'firebase';
import { loadingComponent } from './Loading';

const WritePost: React.FC = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    async function uploadPost() {
        /**
         * @author Mohamad Abdel Rida
         *  Uploads a post
         */
        const user = app.auth().currentUser;
        setLoading(true);

        if (user) {
            await FireStoreDB.uploadDoc<PostDoc>('posts', {
                title: title,
                uid: user.uid,
                content: content,
                timestamp: firebase.firestore.Timestamp.now(),
            });
            setLoading(false);
        }
    }
    return loading ? (
        loadingComponent
    ) : (
        <IonList>
            <IonListHeader>
                <IonLabel>Write Post</IonLabel>
            </IonListHeader>
            <IonItem>
                <IonLabel>Title</IonLabel>
                <IonInput
                    type="text"
                    value={title}
                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => setTitle(e.detail.value ?? '')}
                ></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel>Content</IonLabel>
                <IonInput
                    type="text"
                    value={content}
                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => setContent(e.detail.value ?? '')}
                ></IonInput>
            </IonItem>
            <IonButton color="danger" onClick={uploadPost}>
                Upload Post
            </IonButton>
        </IonList>
    );
};
export default WritePost;