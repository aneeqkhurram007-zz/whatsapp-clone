import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db, auth } from '../firebase'
import { useRouter } from 'next/router'
import { Avatar } from '@material-ui/core'
import { TimeAgo } from 'timeago-react'
import firebase from 'firebase'
import { MoreVert, AttachFile, InsertEmoticon, Mic } from '@material-ui/icons'
import { useCollection } from 'react-firebase-hooks/firestore'
import getRecipientEmail from '../utils/getRecipientEmail'
import Message from './Message'
const ChatScreen = ({ chat, messages }) => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const endofmessageRef = useRef(null);
    const [input, setInput] = useState('')
    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'))
    const [recipientSnapshot] = useCollection(db.collection("users").where('email', '==', getRecipientEmail(chat.users, user)))

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id} messageuser={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        }
        else {
            return JSON.parse(messages).map((message) => (
                <Message key={message.id} user={message.user}
                    message={message}

                />
            ))
        }
    }

    const scrollToBottom = () => {
        endofmessageRef.current.scrollIntoView({
            behaviour: "smooth",
            block: "start"

        });
    }

    //update lastSeen
    const sendMessage = (e) => {
        e.preventDefault();
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true, })


        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        })
        setInput('')
        scrollToBottom();
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <Avatar src={recipient?.photoURL} />
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last seen: {''}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : "Unavailable"

                            } </p>
                    ) : (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endofmessageRef} />
            </MessageContainer>
            <InputContainer>
                <InsertEmoticon />
                <Input value={input} onChange={(e) => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <Mic />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen
const Container = styled.div`
`
const Header = styled.div`
position: sticky;
background-color: white;
z-index: 1000;
top: 0;
display: flex;
padding: 11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`
const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1;
>h3{
    margin-bottom: 3px;

}
>p{
    font-size: 14px;
    color: gray;
}
`
const HeaderIcons = styled.div`
`
const IconButton = styled.div``
const MessageContainer = styled.div`
padding: 30px;
background-color: #e5ded8;
min-height: 90vh;
`

const EndOfMessage = styled.div`
margin-bottom:50px
`
const InputContainer = styled.form`
display: flex;
align-items: center;
padding:10px;
position: sticky;
bottom:0;
background-color: white;
z-index:100
`
const Input = styled.input`
flex: 1;
outline: 0;
border: none;
border-radius: 10px;
background-color: whitesmoke;
padding: 20px;
margin: auto 15px

`