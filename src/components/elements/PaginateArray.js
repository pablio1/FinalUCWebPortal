import React, {Component} from "react";



export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentDidMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
        
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    onUpdatePager = (e) => {
        this.props.onUpdatePager(e);
    }

    setPage(page) {
        let items = this.props.items;
        //let pager = this.state.pager;
        let pager = this.props.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(items.length, page);

        // get new page of items from items array
        let pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
        
        // update state
        //this.setState({ pager: pager });
        this.onUpdatePager(pager);

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        //console.log("paginate",this.props.items);
        //let pager = this.state.pager;
        let pager = this.props.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
            <nav className="pagination is-centered is-small" role="navigation" aria-label="pagination">
                <span className="pagination-previous" disabled={pager.currentPage === 1 ? true : false}
                    onClick={() => this.setPage(pager.currentPage - 1)}>
                    Previous</span>
                <span className="pagination-next" disabled={pager.currentPage === pager.totalPages ? true : false}
                    onClick={() => this.setPage(pager.currentPage + 1)}>Next page</span>
                <ul className="pagination-list">
                    <li disabled={pager.currentPage === 1 ? true : false}>
                        <span className="pagination-link" onClick={() => this.setPage(1)}>First</span>
                    </li>                   
                    {pager.pages.map((page, index) =>
                        <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                            <span className="pagination-link" onClick={() => this.setPage(page)}>{page}</span>
                        </li>
                    )}                   
                    <li disabled={pager.currentPage === pager.totalPages ? true : false}>
                        <span className="pagination-link" onClick={() => this.setPage(pager.totalPages)}>Last</span>
                    </li>
                </ul>
            </nav>
        );
    }
}
