import React, { Component,Fragment } from 'react';

export default class CurriculumTabs extends Component {
  render() {
	  const{selectedTab, handleOnClickTab} = this.props;
	return (
		<Fragment>
			 <div className="buttons has-addons is-centered">                
                <button name="pending" className={"button"+(selectedTab ==  1 ? " is-info is-selected":"")} onClick={() => handleOnClickTab(1)}>
                    <span className="icon is-small">
                        <i className="fas fa-book is-success"></i>
                    </span>
                    <span>View Curriculum</span>
				</button>
				<button name="pending" className={"button"+(selectedTab ==  2 ? " is-info is-selected":"")} onClick={() => handleOnClickTab(2)}>
                    <span className="icon is-small">
                        <i className="fas fa-book is-success"></i>
                    </span>
                    <span>Add Curriculum</span>
				</button>
			</div>
		</Fragment>
	);
  }
}
