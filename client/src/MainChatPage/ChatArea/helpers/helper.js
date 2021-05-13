export default async function sendJoin(user_id,username,chat_id) {

    this.clientRef.sendMessage(`/app/chat.addUser/${chat_id}`,
      JSON.stringify({ sender: this.state.username, type: 'JOIN' })
    )
    try{
        const response = await fetch("http://localhost:8080/api/goOnline", {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user_id,
                  })
              });
            const status = await response.status;
              if (status === 200) {     
                alert("User is now Online")
              }
              else
              {
                  alert("ERROR occured is_active")
              }
    }
    catch (e)
    {
        console.error(e);
    }
    
  }

