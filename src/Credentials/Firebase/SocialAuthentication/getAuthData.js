const getAuthorizedData = (response) => {
    if(response){
        let username = response.providerData[0].displayName
        let email = response.providerData[0].email
        let photoUrl = response.providerData[0].photoURL
        let company = response.providerData[0].providerId
        let uid = response.uid
        let data = { 'username': username, 'email': email, 'photoUrl': photoUrl, 'company': company, 'uid': uid }
        return (data)
    }
}
export { getAuthorizedData }