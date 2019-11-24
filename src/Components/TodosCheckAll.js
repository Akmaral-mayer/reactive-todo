import React from 'react';
import PropTypes from 'prop-types';

const TodosCheckAll = props => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={!props.anyRemaining()}
                        onChange={props.checkAllTodos} />
                    Check All
                </label>
            </div>
        </div>
    );
};

TodosCheckAll.propTypes = {
    anyRemaining: PropTypes.func.isRequired
};

export default TodosCheckAll;