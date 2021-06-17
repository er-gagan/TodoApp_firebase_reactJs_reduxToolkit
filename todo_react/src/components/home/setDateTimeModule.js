const setDatefun = () => {
    let d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    let dd = d.getDate();
    let mm = d.getMonth(); //January is 0!
    let yyyy = d.getFullYear();
    return ({ yyyy, mm, dd, hours, minutes, seconds });
}

const setTimefun = (d) => {
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();

    // 12 hour format logic
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    if (String(hours).length === 1) {
        hours = "0" + String(hours)
    }
    if (String(minutes).length === 1) {
        minutes = "0" + String(minutes)
    }
    if (String(seconds).length === 1) {
        seconds = "0" + String(seconds)
    }
    let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime
}

const Datefun = (d) => {
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = d.getFullYear();

    let date = dd + '/' + mm + '/' + yyyy;
    return date
}

export { setDatefun, setTimefun, Datefun }