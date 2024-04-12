import { Link } from 'react-router-dom';
import SimpleBar from "simplebar-react";
import { Input,Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Table, UncontrolledDropdown,Modal,ModalHeader,ModalBody } from 'reactstrap';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

const DocumentsTab = () => {
  const [modal, setModal] = useState<boolean>(false);
    const toggleModal = useCallback(() => {
        if (modal) {
          setModal(false);
        } else {
          setModal(true);
        }
      }, [modal]);
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="d-flex align-items-center mb-4">
                        <h5 className="card-title flex-grow-1">Documents</h5>
                    </div>
                    <Row>
                        <Col lg={12}>
                            <div className="table-responsive table-card">
                                <Table className="table-borderless align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">File Name</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Upload Date</th>
                                            <th scope="col" style={{ width: "120px" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr> 
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                                            <i className="ri-folder-zip-line"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h5 className="fs-14 mb-0"><Link to="#" className="text-body">Artboard-documents.zip</Link></h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Zip File</td>
                                            <td>4.57 MB</td>
                                            <td>12 Dec 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-soft-secondary btn-sm btn-icon">
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-bottom text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-bottom text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-light text-danger rounded fs-24">
                                                            <i className="ri-file-pdf-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h5 className="fs-14 mb-0"><Link to="#" className="text-body">Bank Management System</Link></h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>PDF File</td>
                                            <td>8.89 MB</td>
                                            <td>24 Nov 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-soft-secondary btn-sm btn-icon">
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-bottom text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-bottom text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                                            <i className="ri-video-line"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h5 className="fs-14 mb-0"><Link to="#" className="text-body">Tour-video.mp4</Link></h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>MP4 File</td>
                                            <td>14.62 MB</td>
                                            <td>19 Nov 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-soft-secondary btn-sm btn-icon">
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-bottom text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-bottom text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-light text-success rounded fs-24">
                                                            <i className="ri-file-excel-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h5 className="fs-14 mb-0"><Link to="#" className="text-body">Account-statement.xsl</Link></h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>XSL File</td>
                                            <td>2.38 KB</td>
                                            <td>14 Nov 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-soft-secondary btn-sm btn-icon">
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-bottom text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-bottom text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-light text-warning rounded fs-24">
                                                            <i className="ri-folder-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h5 className="fs-14 mb-0"><Link to="#" className="text-body">Project Screenshots Collection</Link></h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Floder File</td>
                                            <td>87.24 MB</td>
                                            <td>08 Nov 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-soft-secondary btn-sm btn-icon">
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-bottom text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-bottom text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm">
                                                        <div className="avatar-title bg-light text-danger rounded fs-24">
                                                            <i className="ri-image-2-fill"></i>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h5 className="fs-14 mb-0"><Link to="#" className="text-body">Velzon-logo.png</Link></h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>PNG File</td>
                                            <td>879 KB</td>
                                            <td>02 Nov 2021</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" href="#" className="btn btn-soft-secondary btn-sm btn-icon">
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <li><DropdownItem><i className="ri-eye-fill me-2 align-bottom text-muted"></i>View</DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-download-2-fill me-2 align-bottom text-muted"></i>Download</DropdownItem></li>
                                                        <li className="dropdown-divider"></li>
                                                        <li><DropdownItem><i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div className="text-center mt-3">
                                <Link to="#" className="text-success "><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i> Load more </Link>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Modal isOpen={modal} toggle={toggleModal} centered className="border-0">
                <ModalHeader toggle={toggleModal} className="p-3 ps-4 bg-success-subtle">
                    Members
                </ModalHeader>
                <ModalBody className="p-4">
                    <div className="search-box mb-3">
                        <Input type="text" className="form-control bg-light border-light" placeholder="Search here..." />
                        <i className="ri-search-line search-icon"></i>
                    </div>

                    <div className="mb-4 d-flex align-items-center">
                        <div className="me-2">
                            <h5 className="mb-0 fs-13">Members :</h5>
                        </div>
                        <div className="avatar-group justify-content-center">
                            <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="" data-bs-original-title="Brent Gonzalez">
                                <div className="avatar-xs">
                                    <img  alt="" className="rounded-circle img-fluid" />
                                </div>
                            </Link>
                            <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="" data-bs-original-title="Sylvia Wright">
                                <div className="avatar-xs">
                                    <div className="avatar-title rounded-circle bg-secondary">
                                        S
                                    </div>
                                </div>
                            </Link>
                            <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="" data-bs-original-title="Ellen Smith">
                                <div className="avatar-xs">
                                    <img  alt="" className="rounded-circle img-fluid" />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
                        <div className="vstack gap-3">
                            <div className="d-flex align-items-center">
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <img  alt="" className="img-fluid rounded-circle" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">Nancy Martino</Link></h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <button type="button" className="btn btn-light btn-sm">Add</button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <div className="avatar-title bg-danger-subtle text-danger rounded-circle">
                                        HB
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">Henry Baird</Link></h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <button type="button" className="btn btn-light btn-sm">Add</button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <img  alt="" className="img-fluid rounded-circle" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">Frank Hook</Link></h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <button type="button" className="btn btn-light btn-sm">Add</button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <img  alt="" className="img-fluid rounded-circle" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">Jennifer Carter</Link></h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <button type="button" className="btn btn-light btn-sm">Add</button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <div className="avatar-title bg-success-subtle text-success rounded-circle">
                                        AC
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">Alexis Clarke</Link></h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <button type="button" className="btn btn-light btn-sm">Add</button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <img  alt="" className="img-fluid rounded-circle" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">Joseph Parker</Link></h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <button type="button" className="btn btn-light btn-sm">Add</button>
                                </div>
                            </div>
                        </div>

                    </SimpleBar>
                </ModalBody>
                <div className="modal-footer">
                    <button type="button" className="btn btn-light w-xs" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-success w-xs">Invite</button>
                </div>

            </Modal>
        </React.Fragment>
    );
};

export default DocumentsTab;