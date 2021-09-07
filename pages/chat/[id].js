import React from 'react'
import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
import styled from 'styled-components'
import { db, auth } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import ChatScreen from '../../components/ChatScreen'
import getRecipientEmail from '../../utils/getRecipientEmail'
const Chat = ({ chat, messages }) => {
    const [user] = useAuthState(auth);
    return (
        <Container>
            <Head>
                <title>Chat wiht {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatComponent>
                <ChatScreen chat={chat} messages={messages} />
            </ChatComponent>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id);
    const messagesRef = await ref.collection('messages').orderBy('timestamp', 'asc').get();

    const messages = messagesRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    //Prep the Chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }

}

const Container = styled.div`
display:flex;
`
const ChatComponent = styled.div`
overflow: scroll;
height: 100vh;
flex: 1;

::-webkit-scrollbar{
    display: none;
}
-ms-overflow-style: none;/*IE and Edge*/
scrollbar-width:none;/*FireFox*/

`