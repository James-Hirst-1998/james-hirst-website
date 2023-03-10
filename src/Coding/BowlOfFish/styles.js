import styled from "styled-components";

export const rulesExitButton = styled.button`
border: solid;
background-color: #B1DAE7;
border-radius: 100%;
font-size: 18px;
height: 35px;
width: 35px;


&:hover {
    cursor: pointer;
    color: black;
    background-color: #B8B8B8;
`;

export const gameQuitButton = styled.button`
border: transparent;
background-color: #B1DAE7;
font-size: 16px;

&:hover {
    cursor: pointer;
    color: red;
`;

export const settingsToggleButton = styled.button`
background-color: #32a83c;
font-size: 14px;
height: 35px;
width: 77px;

&:hover {
    cursor: pointer;
    color: black;
    background-color: #B8B8B8;

&:active {
        background-color: #3e8e41;
        box-shadow: 0 5px #666;
        transform: translateY(2px);
`;

export const addWordButton = styled.button`
background-color: #c6cbcc;
font-size: 14px;
height: 35px;
width: 100px;

&:hover {
    cursor: pointer;
    color: black;
    background-color: #989d9e;

&:active {
        background-color: #878b8c;
        box-shadow: 0 5px #666;
        transform: translateY(2px);
`;

export const startGameButton = styled.button`
background-color: #f25a6b;
font-size: 14px;
height: 35px;
width: 230px;

&:hover {
    cursor: pointer;
    color: black;
    background-color: #c94d5b;

&:active {
        background-color: #f5162f;
        box-shadow: 0 5px #666;
        transform: translateY(2px);
`;

export const activeGameButton = styled.button`
background-color: #c2f0ce;
font-size: 14px;
height: 35px;
width: 230px;
`


export const correctButton = styled.button`
background-color: #119c1a;
font-size: 14px;
height: 35px;
width: 150px;

&:hover {
    cursor: pointer;
    color: black;
    background-color: #14c920;

&:active {
        background-color: #21fc30;
        box-shadow: 0 5px #666;
        transform: translateY(2px);
`;

export const skipButton = styled.button`
background-color: #cc861d;
font-size: 14px;
height: 35px;
width: 150px;

&:hover {
    cursor: pointer;
    color: black;
    background-color: #e69722;

&:active {
        background-color: #f7a428;
        box-shadow: 0 5px #666;
        transform: translateY(2px);
`;