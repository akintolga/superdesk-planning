import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {getDateFormat} from '../../../selectors/config';
import * as selectors from '../../../selectors';
import {gettext} from '../../../utils';
import {Row} from '../../UI/Preview/';
import {RepeatEventSummary} from '../../Events';
import {EndsInput} from '../../Events/RecurringRulesInput/EndsInput';
import '../style.scss';
import {get, set, cloneDeep, isEqual} from 'lodash';
import {EVENTS} from '../../../constants';
import {validateItem} from '../../../validators';

export class UpdateEventRepetitionsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            errors: {},
            diff: {},
        };

        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            diff: cloneDeep(this.props.initialValues),
        });
    }

    onChange(field, value) {
        const diff = cloneDeep(get(this.state, 'diff') || {});
        const errors = cloneDeep(this.state.errors);

        set(diff, field, value);

        this.props.onValidate(
            diff,
            this.props.formProfiles,
            errors
        );

        this.setState({
            diff: diff,
            dirty: !isEqual(this.props.initialValues, diff),
            errors: errors,
        });

        if (isEqual(diff.dates, this.props.initialValues.dates) || !isEqual(errors, {})) {
            this.props.disableSaveInModal();
        } else {
            this.props.enableSaveInModal();
        }
    }

    submit() {
        // Modal closes after submit. So, reseting submitting is not required
        this.setState({submitting: true});
        this.props.onSubmit(this.state.diff);
    }

    render() {
        const {initialValues, dateFormat} = this.props;
        const {diff} = this.state;

        const frequency = get(diff, 'dates.recurring_rule.frequency');
        const endRepeatMode = get(diff, 'dates.recurring_rule.endRepeatMode');
        const until = get(diff, 'dates.recurring_rule.until');
        const count = get(diff, 'dates.recurring_rule.count');
        const byDay = get(diff, 'dates.recurring_rule.byday');
        const startDate = get(diff, 'dates.start');
        const interval = get(diff, 'dates.recurring_rule.interval');

        return (
            <div className="MetadataView">
                <Row
                    enabled={!!initialValues.slugline}
                    label={gettext('Slugline')}
                    value={initialValues.slugline || ''}
                    className="slugline"
                    noPadding={true}
                />

                <Row
                    label={gettext('Name')}
                    value={initialValues.name || ''}
                    className="strong"
                    noPadding={true}
                />

                <Row
                    label={gettext('Series Start Date')}
                    value={initialValues._recurring[0].dates.start.format(dateFormat) || ''}
                    className="strong"
                    noPadding={true}
                />

                <Row>
                    <RepeatEventSummary
                        byDay={byDay}
                        interval={interval}
                        frequency={frequency}
                        endRepeatMode={endRepeatMode}
                        until={until}
                        count={count}
                        startDate={startDate}
                    />
                </Row>

                <EndsInput
                    count={count}
                    until={until}
                    endRepeatMode={endRepeatMode}
                    onChange={this.onChange}
                    dateFormat={dateFormat}
                    readOnly={this.state.submitting}
                    errors={get(this.state.errors, 'dates.recurring_rule')}
                    label={gettext('Ends')}
                />
            </div>
        );
    }
}

UpdateEventRepetitionsComponent.propTypes = {
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    enableSaveInModal: PropTypes.func,
    disableSaveInModal: PropTypes.func,
    dateFormat: PropTypes.string.isRequired,
    onValidate: PropTypes.func,
    formProfiles: PropTypes.object,
};

const mapStateToProps = (state) => ({
    dateFormat: getDateFormat(state),
    formProfiles: selectors.forms.profiles(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (event) => dispatch(actions.events.ui.updateRepetitions(event)),
    onHide: (event) => {
        if (event.lock_action === EVENTS.ITEM_ACTIONS.UPDATE_REPETITIONS.lock_action) {
            dispatch(actions.events.api.unlock(event));
        }
    },
    onValidate: (item, profile, errors) => dispatch(validateItem('events', item, profile, errors, ['dates']))
});

export const UpdateEventRepetitionsForm = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {withRef: true}
)(UpdateEventRepetitionsComponent);
