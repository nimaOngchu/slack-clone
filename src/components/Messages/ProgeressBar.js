import React from 'react';
import { Progress } from 'semantic-ui-react';

export default function ProgeressBar({ percentuploaded, uploadState }) {
    if(uploadState && uploadState === 'uploading'){
        return <Progress
            percent={percentuploaded}
            className='progress_bar'
            progress
            indicating
            size='medium'
            inverted
            />
    }else return null

}
