
import React from 'react'
import { DotLoader } from 'react-spinners'
const Loading = () => {
    return (
        <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <div>
                <img height={200} style={{ marginBottom: 10 }} alt="img" src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
            </div>
            <DotLoader color="#3CBC28" size={60} />
        </center>
    )
}

export default Loading
