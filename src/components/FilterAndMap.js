import React from 'react'
import { Stack,Box } from '@mui/material'
import DarkButton from './DarkButton'

const FilterAndMap = () => {
    return (
        <Stack maxWidth={'1300px'} >
            <Box
                display={'flex'}
                gap={'7px'}
                padding={'8px'}
                border={'2px solid #000'}
                width={'max-content'}
                borderRadius={'10em'}
            >
                <DarkButton buttonTitle={'Filter'} />
                <DarkButton buttonTitle={'Show Map'} />
            </Box>
        </Stack>
    )
}

export default FilterAndMap