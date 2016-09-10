async function get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let xhr: XMLHttpRequest = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            let requestFinished: boolean = xhr.readyState == XMLHttpRequest.DONE;

            if(requestFinished) {
                let isSuccess: boolean = xhr.status >= 200 && xhr.status < 300;

                if(isSuccess) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.response);
                }
            }
        };

        xhr.open('GET', url);

        xhr.send();
    });
}

export default {
    get
};