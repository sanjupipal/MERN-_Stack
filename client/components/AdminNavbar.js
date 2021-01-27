import React from "react";
import Link from "next/link";
import {isAuth, logout} from '../helpers/auth'
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

class AdminNavbar extends React.Component {
  render() {
    return (
      <>
        <Navbar className="nav nav-tabs bg-warning" expand="md" id="navbar-main">
          <Container fluid>
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-3" nav>
                  <Media className="align-items-center">
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="text-sm font-weight-bold">
                      {isAuth().name}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <Link href="/admin">
                    <DropdownItem>
                      <i className="ni ni-single-02" />
                      <span>My profile</span>
                    </DropdownItem>
                  </Link>
                  <Link href="/user/profile/update">
                    <DropdownItem>
                      <i className="ni ni-single-02" />
                      <span>Update profile</span>
                    </DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem
                    href="#pablo"
                    onClick={logout}>
                    <i className="ni ni-user-run" />
                    <span >Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
