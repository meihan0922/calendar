import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../components/Button/Button.js';

const demoField = {
    width: '300px',
};
class DemoButton extends Component {
    constructor(props) {
        super(props);
    }
    onClick = (e) => {
        console.log('Clicked!' + e.target);
    }
    render() {
        return (
            <div style={Object.assign({}, demoField)}>
                <h3>Class:bd_red</h3>
                <Button text='點我'
                    type="button"
                    link=''
                    className='bd_red'
                    onClick={(e)=>this.onClick(e)}
                />
                <h3>Class:bd_gray</h3>
                <Button text='一般按鈕'
                    type="button"
                    link=''
                    className='bd_gray'
                    onClick={(e) => this.onClick(e)}
                />
            </div>
        );
    }
}

storiesOf('Button', module).add('default', () => (
    <DemoButton />
));
