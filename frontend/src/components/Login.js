import React, { useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Form, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
      localStorage.setItem('token', res.data.token);
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="rbt-header-sticky">
      {/* Header */}
      <header className="rbt-header rbt-header-10">
        <div className="rbt-header-top rbt-header-top-1 header-space-between bg-not-transparent bg-color-darker top-expended-activation">
          <Container fluid>
            <div className="top-expended-wrapper">
              <div className="top-expended-inner rbt-header-sec align-items-center">
                <div className="rbt-header-sec-col rbt-header-left d-none d-xl-block">
                  <div className="rbt-header-content">
                    <div className="header-info">
                      <ul className="rbt-information-list">
                        <li>
                          <a href="#"><i className="fab fa-instagram"></i>100k <span className="d-none d-xxl-block">Followers</span></a>
                        </li>
                        <li>
                          <a href="#"><i className="fab fa-facebook-square"></i>500k <span className="d-none d-xxl-block">Followers</span></a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="rbt-header-sec-col rbt-header-center">
                  <div className="rbt-header-content justify-content-start justify-content-xl-center">
                    <div className="header-info">
                      <div className="rbt-header-top-news">
                        <div className="inner">
                          <div className="content">
                            <span className="rbt-badge variation-02 bg-color-primary color-white radius-round">Just In</span>
                            <span className="news-text">
                              <img src="http://leadership-accelerator.s3-website.eu-north-1.amazonaws.com/assets/images/icons/hand-emojji.svg" alt="Hand Emojji" /> Intro price. Get Leadership Accelerator for Big Sale -15% off.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rbt-header-sec-col rbt-header-right mt_md--10 mt_sm--10">
                  <div className="rbt-header-content justify-content-start justify-content-lg-end">
                    <div className="header-info d-none d-xl-block">
                      <ul className="social-share-transparent">
                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                      </ul>
                    </div>
                    <div className="rbt-separator d-none d-xl-block"></div>
                    <div className="header-info">
                      <ul className="rbt-dropdown-menu currency-menu">
                        <li className="has-child-menu">
                          <a href="#">
                            <span className="menu-item">INR</span>
                            <i className="right-icon feather-chevron-down"></i>
                          </a>
                          <ul className="sub-menu hover-reverse">
                            <li><a href="#"><span className="menu-item">USD</span></a></li>
                            <li><a href="#"><span className="menu-item">EUR</span></a></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
        <div className="rbt-header-wrapper header-space-between header-sticky">
          <Container fluid>
            <div className="mainbar-row rbt-navigation-center align-items-center">
              <div className="header-left rbt-header-content">
                <div className="header-info">
                  <div className="logo logo-dark">
                    <a href="/"><img src="http://leadership-accelerator.s3-website.eu-north-1.amazonaws.com/assets/images/logo/logo.png" alt="Education Logo" /></a>
                  </div>
                </div>
              </div>
              <div className="rbt-main-navigation d-none d-xl-block">
                <Nav className="mainmenu-nav">
                  <ul className="mainmenu">
                    <li><a href="/">Home</a></li>
                    <li className="with-megamenu has-menu-child-item">
                      <a href="#">Assessments <i className="feather-chevron-down"></i></a>
                    </li>
                    <li className="with-megamenu has-menu-child-item">
                      <a href="#">Courses <i className="feather-chevron-down"></i></a>
                    </li>
                    <li className="with-megamenu has-menu-child-item">
                      <a href="#">For Individuals <i className="feather-chevron-down"></i></a>
                    </li>
                    <li className="with-megamenu has-menu-child-item">
                      <a href="#">For Organizations <i className="feather-chevron-down"></i></a>
                    </li>
                    <li><a href="/the-masterclass">The MasterClass&trade;</a></li>
                    <li><a href="/books">Books</a></li>
                  </ul>
                </Nav>
              </div>
              <div className="header-right">
                <ul className="quick-access">
                  <li className="access-icon">
                    <a className="search-trigger-active rbt-round-btn" href="#"><i className="feather-search"></i></a>
                  </li>
                  <li className="access-icon rbt-mini-cart">
                    <a className="rbt-cart-sidenav-activation rbt-round-btn" href="#">
                      <i className="feather-shopping-cart"></i>
                      <span className="rbt-cart-count">4</span>
                    </a>
                  </li>
                </ul>
                <div className="rbt-btn-wrapper d-none d-xl-block">
                  <a className="rbt-btn btn-border-gradient radius-round btn-sm hover-transform-none" href="#">
                    <span data-text="Enroll Now">Start Now</span>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="breadcrumb-inner text-center">
                <h2 className="title">Login & Register</h2>
                <Breadcrumb>
                  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                  <Breadcrumb.Item active>Login & Register</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Login/Register Forms */}
      <div className="rbt-elements-area bg-color-white rbt-section-gap">
        <Container>
          <Row className="gy-5 row--30">
            <Col lg={6}>
              <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                <h3 className="title">Login</h3>
                {error && <p className="text-danger text-center">{error}</p>}
                <Form className="max-width-auto" onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <Form.Control
                      name="con_name"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                    <Form.Label>Username or email *</Form.Label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="form-group">
                    <Form.Control
                      name="con_email"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <Form.Label>Password *</Form.Label>
                    <span className="focus-border"></span>
                  </div>
                  <Row className="mb--30">
                    <Col lg={6}>
                      <div className="rbt-checkbox">
                        <Form.Check type="checkbox" id="rememberme" name="rememberme" />
                        <Form.Label htmlFor="rememberme">Remember me</Form.Label>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="rbt-lost-password text-end">
                        <a className="rbt-btn-link" href="#">Lost your password?</a>
                      </div>
                    </Col>
                  </Row>
                  <div className="form-submit-group">
                    <Button type="submit" className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Log In</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      </span>
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
            <Col lg={6}>
              <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                <h3 className="title">Register</h3>
                {error && <p className="text-danger text-center">{error}</p>}
                <Form className="max-width-auto" onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <Form.Control
                      name="register-email"
                      type="text"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                    <Form.Label>Email address *</Form.Label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="form-group">
                    <Form.Control
                      name="register_user"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                    />
                    <Form.Label>Username *</Form.Label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="form-group">
                    <Form.Control
                      name="register_password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                    <Form.Label>Password *</Form.Label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="form-group">
                    <Form.Control
                      name="register_conpassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                    <Form.Label>Confirm Password *</Form.Label>
                    <span className="focus-border"></span>
                  </div>
                  <div className="form-submit-group">
                    <Button type="submit" className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Register</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      </span>
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Newsletter */}
      <div className="rbt-newsletter-area bg-gradient-6 ptb--50">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg={5} md={12} xs={12}>
              <div className="inner">
                <div className="section-title text-center text-lg-start">
                  <h4 className="title">
                    <strong>Subscribe</strong> <br /> <span className="w-400">Our Newsletter</span>
                  </h4>
                </div>
              </div>
            </Col>
            <Col lg={7} md={12} xs={12} className="text-start text-sm-end">
              <Form className="newsletter-form-1 me-0">
                <Form.Control type="email" placeholder="Enter Your E-Email" />
                <Button type="submit" className="rbt-btn btn-md btn-gradient hover-icon-reverse">
                  <span className="icon-reverse-wrapper">
                    <span className="btn-text">Subscribe</span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                  </span>
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="rbt-footer footer-style-1">
        <div className="footer-top">
          <Container>
            <Row className="row--15 mt_dec--30">
              <Col lg={4} md={6} sm={6} xs={12} className="mt--30">
                <div className="footer-widget">
                  <div className="logo logo-dark">
                    <a href="/"><img src="http://leadership-accelerator.s3-website.eu-north-1.amazonaws.com/assets/images/logo/logo.png" alt="Edu-cause" /></a>
                  </div>
                  <p className="description mt--20">
                    We’re always in search for talented and motivated people. Don’t be shy introduce yourself!
                  </p>
                  <div className="contact-btn mt--30">
                    <a className="rbt-btn hover-icon-reverse btn-border-gradient radius-round" href="#">
                      <div className="icon-reverse-wrapper">
                        <span className="btn-text">Contact With Us</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      </div>
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg={2} md={6} sm={6} xs={12} className="mt--30 offset-lg-1">
                <div className="footer-widget">
                  <h5 className="ft-title">Useful Links</h5>
                  <ul className="ft-link">
                    <li><a href="#">Marketplace</a></li>
                    <li><a href="#">kindergarten</a></li>
                    <li><a href="#">University</a></li>
                    <li><a href="#">GYM Coaching</a></li>
                    <li><a href="#">FAQ</a></li>
                  </ul>
                </div>
              </Col>
              <Col lg={2} md={6} sm={6} xs={12} className="mt--30">
                <div className="footer-widget">
                  <h5 className="ft-title">Our Company</h5>
                  <ul className="ft-link">
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Become Teacher</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Instructor</a></li>
                    <li><a href="#">Events</a></li>
                  </ul>
                </div>
              </Col>
              <Col lg={3} md={6} sm={6} xs={12} className="mt--30">
                <div className="footer-widget">
                  <h5 className="ft-title">Get Contact</h5>
                  <ul className="ft-link">
                    <li><span>Phone:</span> <a href="#">(406) 555-0120</a></li>
                    <li><span>E-mail:</span> <a href="mailto:hr@example.com">rainbow@example.com</a></li>
                    <li><span>Location:</span> North America, USA</li>
                  </ul>
                  <ul className="social-icon social-default icon-naked justify-content-start mt--20">
                    <li><a href="https://www.facebook.com/"><i className="feather-facebook"></i></a></li>
                    <li><a href="https://www.twitter.com"><i className="feather-twitter"></i></a></li>
                    <li><a href="https://www.instagram.com/"><i className="feather-instagram"></i></a></li>
                    <li><a href="https://www.linkdin.com/"><i className="feather-linkedin"></i></a></li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
      <div className="rbt-separator-mid">
        <Container>
          <hr className="rbt-separator m-0" />
        </Container>
      </div>
      <div className="copyright-area copyright-style-1 ptb--20">
        <Container>
          <Row className="align-items-center">
            <Col xxl={6} xl={6} lg={6} md={12} xs={12}>
              <p className="rbt-link-hover text-center text-lg-start">
                Copyright © 2025 <a href="https://majormod.com"> Leadership Accelerator.</a> All Rights Reserved
              </p>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={12} xs={12}>
              <ul className="copyright-link rbt-link-hover justify-content-center justify-content-lg-end mt_sm--10 mt_md--10">
                <li><a href="#">Terms of service</a></li>
                <li><a href="/privacy-policy">Privacy policy</a></li>
                <li><a href="#">Subscription</a></li>
                <li><a href="/login">Login & Register</a></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Login;