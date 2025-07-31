import './deleteUser.css';
const url = "http://localhost:5000/";

class DeleteUser {
    constructor() {
    
    }

    public init = (): void => {
       console.log("it's working!");
       

       const deleteUserButton = document.getElementById("delete-button") as HTMLButtonElement;
       console.log(deleteUserButton);

       deleteUserButton.addEventListener("click", () => {
        const usernameInput = document.getElementById("username") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        console.log("usernameInput:", usernameInput);
        const usernameString: string = usernameInput.value;
        const passwordString: string = passwordInput.value;
        console.log("username", usernameString);                    

        console.log('deleteUser?username=' + usernameString)
        console.log('password:', passwordString)
        fetch('http://localhost:5000/deleteUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameString,
                password: passwordString
            }),
        })
       })
    }
}

const deleteUser: DeleteUser = new DeleteUser();
deleteUser.init();