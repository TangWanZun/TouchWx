import createPage from './workPage.js'
import { configUrl } from '../../../library/sdk.js'
Page(createPage({
        data:{
                imgUrl: configUrl.imgUrl,
        }
}))