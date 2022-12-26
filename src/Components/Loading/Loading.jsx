import React from 'react'
import styled from 'styled-components'
import { Bars } from 'react-loading-icons'

function Loading() {
    return (
        <Container>
            <Bars />
        </Container>
    )
}

export default Loading

const Container = styled.div`
    position: fixed;
    height: 100vh;
    top: 0;
    right: 0;
    width: 100vw;
    background-color: #adadad2c;
    display: flex;
    align-items: center;
    justify-content: center;
`