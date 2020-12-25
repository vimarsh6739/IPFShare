import React from "react";
import {Navbar, Nav} from 'react-bootstrap';

export class Header extends React.Component {
    render() {
        return (
        <Navbar bg="light" expand="lg">
            {/* Printing account address currently using dapp */}
            <Navbar.Brand href="/">{this.props.user.substring(0,5) + ".."}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/send">Send Data</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            
        </Navbar>
        );
    }
}