import axios from "axios";
import { useEffect, useState } from "react"

export default function Chat(props){
	const {isExistingChat, selectedUser, currentChat, username, socket, chatID} = props
	const [message, setMessage] = useState()

	async function handleMessage(event){
		event.preventDefault()
		const messageForm = {
			message: message,
			sender: username,
			receiver: selectedUser
		}
		if(isExistingChat){
			await socket.emit('send-message', messageForm, chatID)
			setMessage('')
		}else if(!isExistingChat){
			await socket.emit('send-message', messageForm, chatID)
			setMessage('')
			await axios.patch('/api/addUserChat', {chatID:chatID, chatPartner:selectedUser, username:username})
		}
	}
	return(
		<>
			<div style={{height:'100%'}}>
				{!currentChat &&
					<div>Loading...</div>
				}
				{currentChat &&
					<>
						<div style={{position:"fixed", top:'60px', width:'100%', backgroundColor:'#fff'}}>
							<h1>
								{selectedUser}
							</h1>
						</div>
						{(currentChat.length < 1) &&
							<div>
								<p>Start chatting with this user.</p>
							</div>
						}
						{(currentChat.length > 0) &&
							<div style={{height:'100%', padding:'100px 20px 30px 20px', display:'flex', flexDirection:'column', backgroundColor:'#efefef', overflowY:'scroll'}}>
								{currentChat.map((chat, index)=>{
									return(
										<div style={{textAlign:chat.sender===username?'right':'left'}}>
											{chat.message}
										</div>
									)
								})}
							</div>
						}
						<form onSubmit={handleMessage} style={{position:'fixed', bottom:'0'}}>
							<input placeholder='Send a message' value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
							<button type='submit'>Send</button>
						</form>
					</>
				}
			</div>
		</>
	)
}