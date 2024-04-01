async function getIDs() {
    let part = "part=snippet&part=status";
    let maxResults = "maxResults=50"
    let pageToken = "pageToken=";
    let playlistID = "playlistId=PLi0jEa63mCgC9Dk3ckoIgSyFmTamXqG63";
    let key = "key=AIzaSyA8LCRB5Nz1CjVS8m_Ii8E8qPNlTqPXWZk";
    let input = "https://youtube.googleapis.com/youtube/v3/playlistItems?" + part + "&" + maxResults + "&" + playlistID + "&" + key;
    let repeats;
    let IdArray;
    let error = false;
    await fetch(input)
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if("error" in data) {
            error = true;
            return;
        }
        
        maxResults = "maxResults=" + data.pageInfo.totalResults;
        repeats = Math.floor((data.pageInfo.totalResults)/50);
        if(repeats != 0) {
            pageToken = "pageToken=" + data.nextPageToken;
        }
        IdArray = new Array(data.pageInfo.totalResults);

        for(let i = 0; i < data.items.length; i++) {
            IdArray[i] = data.items[i].snippet.resourceId.videoId
            if(data.items[i].snippet.description == "This video is unavailable.") {
                IdArray[i] += "NULL"
            } else if(data.items[i].status.privacyStatus != "public") {
                IdArray[i] += "NOTPUBLIC"
            }
        }

        console.log(IdArray);   
    });
    if(error) {
        console.log("Your playlist could not be found. Make sure your playlist is either public or unlisted.")
        return;
    }
    for(let j = 0; j < repeats; j++) {
        input = "https://youtube.googleapis.com/youtube/v3/playlistItems?" + part + "&" + maxResults + "&" + pageToken + "&" + playlistID + "&" + key;
        await fetch(input)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            for(let i = 0; i < data.items.length; i++) {
                IdArray[i+((j+1)*50)] = data.items[i].snippet.resourceId.videoId
                if(data.items[i].snippet.description == "This video is unavailable.") {
                    IdArray[i+((j+1)*50)] += " NULL"
                } else if(data.items[i].status.privacyStatus != "public") {
                    IdArray[i+((j+1)*50)] += " NOTPUBLIC"
                }
            }

            if(j != repeats-1) {
                pageToken = "pageToken=" + data.nextPageToken;
            } 
            console.log(IdArray);
        });
    }
    for(let i = 0; i < IdArray.length; i++) {
        console.log("https://www.youtube.com/watch?v=" + IdArray[i] + "\n");
    }
}

getIDs();