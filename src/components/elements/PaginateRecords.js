import React, {Component} from "react";

export default class PaginateRecords extends Component {
    onChangeRowsPerPage = e => {
        this.props.onChangeRowsPerPage(e.target.value);
    }
    handleOnClickPage = e => {
        this.props.handleOnClickPage(e);
    }

    render(){
        const { totalRowsCount, rowsPerPage, pageNum } = this.props;
        const totalNumPages = totalRowsCount && rowsPerPage ? Math.ceil(parseInt(totalRowsCount, 10) / parseInt(rowsPerPage, 10)) : 0;
        const loadPageLinks = totalNumPages ? [...Array(totalNumPages)].map((e, i) => {
            return (
                <li key={i}>
                    <div className={"pagination-link is-clickable " + (pageNum === (i+1) ? "is-current" : "") } 
                         aria-label={"Page " + i+1} aria-current="page" onClick={() => this.handleOnClickPage(i + 1)}>{i + 1}</div>
                </li>
            )
        }) : "";
        return(
            <nav className="pagination is-small" role="navigation" aria-label="pagination">
                <button className="button pagination-previous" disabled={pageNum === 1 ? true : false} onClick={() => this.handleOnClickPage(pageNum - 1)} >Previous</button>
                <button className="button pagination-next" disabled={pageNum >= totalNumPages ? true : false} onClick={() => this.handleOnClickPage(pageNum + 1)} >Next page</button>
                <div className="control">
                    <div className="select is-small">
                        <select name={rowsPerPage} value={rowsPerPage} onChange={this.onChangeRowsPerPage}>
                            <option value="5">Show 5</option>
                            <option value="20">Show 20</option>
                            <option value="50">Show 50</option>
                            <option value="80">Show 80</option>
                            <option value="100">Show 100</option>
                            <option value="200">Show 200</option>
                        </select>
                    </div>
                </div>
                <div className="control">
                    <h4 className="is-size-7 has-text-weight-bold ml-2 mr-2">of {totalRowsCount}</h4>
                </div>
                <ul className="pagination-list">
                    {loadPageLinks ? loadPageLinks : ""}
                </ul>
            </nav>
        );       
    }
}