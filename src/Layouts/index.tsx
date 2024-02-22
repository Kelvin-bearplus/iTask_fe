import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import withRouter from '../Components/Common/withRouter';

//import Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

//import actions


//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';

const Layout = (props : any) => {
    const [headerClass, setHeaderClass] = useState("");
    const dispatch : any = useDispatch();

    const selectLayoutState = (state : any) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            layoutType: layout.layoutType,
            leftSidebarType: layout.leftSidebarType,
            layoutModeType: layout.layoutModeType,
            layoutWidthType: layout.layoutWidthType,
            layoutPositionType: layout.layoutPositionType,
            topbarThemeType: layout.topbarThemeType,
            leftsidbarSizeType: layout.leftsidbarSizeType,
            leftSidebarViewType: layout.leftSidebarViewType,
            leftSidebarImageType: layout.leftSidebarImageType,
            preloader: layout.preloader,
            sidebarVisibilitytype: layout.sidebarVisibilitytype,
        })
    );
    // Inside your component
    const {
        layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        sidebarVisibilitytype
    } = useSelector(selectLayoutProperties);

    /*
    layout settings
    */
    /*
    call dark/light mode
    */

    // class add remove in header 
    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setHeaderClass("topbar-shadow");
        } else {
            setHeaderClass("");
        }
    }

    useEffect(() => {
        const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;
        if (sidebarVisibilitytype === 'show' || layoutType === "vertical" || layoutType === "twocolumn") {
            humberIcon.classList.remove('open');
        } else {
            humberIcon && humberIcon.classList.add('open');
        }
    }, [sidebarVisibilitytype, layoutType]);

    return (
        <React.Fragment>
            <div id="layout-wrapper">
                <Header
                    headerClass={headerClass}
                    layoutModeType={layoutModeType}
                    />
                <Sidebar
                    layoutType={layoutType}
                />
                <div className="main-content">
                    {props.children}
                    <Footer />
                </div>
            </div>
        </React.Fragment>

    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default withRouter(Layout);