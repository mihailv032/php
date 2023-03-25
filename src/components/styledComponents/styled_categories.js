import styled from 'styled-components'

export const Container = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10000;

  background-color: white;
  border-radius: 10px;
`

export const CategoryBtn = styled.button`
  background: ${ props => props.active ? "initial" : "#FF4742"};
  border: 1px solid #FF4742;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin: 10px;
  outline: none;
  padding: 2px 5px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover{
  background-color: initial;
  background-position: 0 0;
  color: #FF4742;

  }
`

export const ShareContainer = styled.form`
  position: relative;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ContextWrapp = styled.div`
  display: inline-block;
  box-sizing: border-box;
`

export const Inp = styled.input`
  width: 100%;
  height: 20px;
 outline: none;
`

export const ResultsContainer = styled.div`
  position: relative;
  width: 100%;
  z-index: 1000;

  background: #0F0F0F;
  border-radius: 5px;
  padding: 10px;
`

export const Result = styled.li`
  color: white;
  list-style-type: none;
  background: #272727;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 5px;
  &:hover {
  background: #3F3F3F;
  }
`

export const ShareBtn = styled.button`
	position: relative;
  background: linear-gradient(to bottom, #5d326c, #350048);
  color: white;
	margin-top: 10px;
	padding: 0;
	box-sizing: border-box;

  border: none;
	top: 0;
	left: 0;
	width: 250px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
  height: 20px;
  width: 150px;
  & span {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(255, 255, 255, 0.05);
	box-shadow: 0 15px 15px rgba(0, 0, 0, 0.3);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 30px;
	padding: 10px;
	letter-spacing: 1px;
	text-decoration: none;
	overflow: hidden;
	color: #fff;
	font-weight: 400px;
	z-index: 1;
	transition: 0.5s;
	backdrop-filter: blur(15px);
	background: #ff1f71;
	box-shadow: 0 0 5px #ff1f71, 0 0 15px #ff1f71, 0 0 30px #ff1f71,
		0 0 60px #ff1f71;

}
  &:hover span {
	letter-spacing: 3px;
}
  & span::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 50%;
	height: 100%;
	background: linear-gradient(to left, rgba(255, 255, 255, 0.15), transparent);
	transform: skewX(45deg) translate(0);
	transition: 0.5s;
	filter: blur(0px);
}
  &:hover span::before {
	transform: skewX(45deg) translate(200px);
}
  &::before {
	content: "";
	position: absolute;
	left: 50%;
	transform: translatex(-50%);
	bottom: -5px;
	width: 30px;
	height: 10px;
	background: #f00;
	border-radius: 10px;
	transition: 0.5s;
	transition-delay: 0.5;
}
  &:hover::before /*lightup button*/ {
	bottom: 0;
	height: 50%;
	width: 80%;
	border-radius: 30px;
}

  &::after {
	content: "";
	position: absolute;
	left: 50%;
	transform: translatex(-50%);
	top: -5px;
	width: 30px;
	height: 10px;
	background: #f00;
	border-radius: 10px;
	transition: 0.5s;
	transition-delay: 0.5;
}
  &:hover::after /*lightup button*/ {
	top: 0;
	height: 50%;
	width: 80%;
	border-radius: 30px;
}
`
