import request from '../utils/request'



// request.get('/db.json').then(response => {
//     console.log(response.data)
// })


// request({
//     method: 'post',
//     url: '/user/12345',
//     data: {
//         firstName: 'Fred',
//         lastName: 'Flintstone'
//     }
// });

const BASE_URI = '/dev-api'


export default {

    getList() {
        const req = request({
            method: 'get',
            url: BASE_URI + '/db.json'
        })
        return req
    }


}