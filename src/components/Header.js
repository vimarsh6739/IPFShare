import React from "react";
import {Navbar, Nav} from 'react-bootstrap';
import {IndexLinkContainer} from 'react-router-bootstrap';

export class Header extends React.Component {
    render() {
        return (
        <Navbar bg="light" expand="lg">
            {/* Printing account address currently using dapp */}
            <IndexLinkContainer to="/">
            <Navbar.Brand>
                {this.props.account.substring(0,5) + ".."}
            </Navbar.Brand>
            </IndexLinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <IndexLinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </IndexLinkContainer>

                    <IndexLinkContainer to="/send">
                        <Nav.Link>Your Data</Nav.Link>
                    </IndexLinkContainer>

                    <IndexLinkContainer to="/searchtab">
                        <Nav.Link>Search Tab</Nav.Link>
                    </IndexLinkContainer>
                </Nav>
            </Navbar.Collapse>
            
        </Navbar>
        );
    }
}