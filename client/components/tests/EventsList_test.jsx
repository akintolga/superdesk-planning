import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { EventsList, EventsListPanelContainer } from '../index'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import * as actions from '../../actions'
import planningApp from '../../reducers'
import thunkMiddleware from 'redux-thunk'

const events = [
    {
        _id: '5800d71930627218866f1e80',
        dates: { start: '2016-10-15T13:01:11+0000' },
        description: { definition_short: 'definition_short 1' },
        location: [{ name: 'location1' }],
        unique_name: 'name1'
    },
    {
        _id: '5800d73230627218866f1e82',
        dates: {
            end: '2016-10-19T13:01:50+0000',
            start: '2016-10-17T13:01:34+0000'
        },
        description: { definition_short: '' },
        location: [{ name: 'location1' }],
        unique_name: 'name2'
    },
    {
        _id: '5800d73230627218866f1d82',
        dates: {
            end: '2016-10-19T13:01:50+0000',
            start: '2016-10-17T13:01:34+0000'
        },
        description: { definition_short: '' },
        location: [{ name: 'location2' }],
        unique_name: 'name3'
    }
]

describe('<EventsList />', () => {
    it('renders events', () => {
        const initialState = { events }
        const store = createStore(
            planningApp,
            initialState,
            applyMiddleware(thunkMiddleware.withExtraArgument(
                {
                    api: () => ({
                        query: () => (Promise.resolve({ _items: events }))
                    })
                }
            ))
        )
        const wrapper = mount(
            <Provider store={store}>
                <EventsListPanelContainer />
            </Provider>
        )
        // there is three events to show
        expect(wrapper.find('li').length).toEqual(3)
        // only two groups, because two share the same date
        expect(wrapper.find('ul').length).toEqual(2)
        // check order
        expect(wrapper.find('.events-list__title').map((e) => e.text()))
        .toEqual(['Saturday October 15, 2016', 'Monday October 17, 2016'])
        // add a new item
        const newEvent = {
            _id: '123',
            dates: {
                end: '2016-11-19T13:01:50+0000',
                start: '2016-10-17T13:01:34+0000'
            },
            description: { definition_short: '' },
            location: [{ name: 'location3' }],
            unique_name: 'name4'
        }
        store.dispatch(actions.addEvent(newEvent))
        expect(wrapper.find('li').length).toEqual(4)
        // update an item
        const updatedEvent = Object.assign({}, newEvent, { unique_name: 'new name' })
        store.dispatch(actions.addEvent(updatedEvent))
        expect(wrapper.find('li').length).toEqual(4)
        expect(wrapper.find('li').last().find('.event__unique-name').text()).toBe('new name')
    })
    it('trigger an event click', () => {
        const onButtonClick = sinon.spy()
        const wrapper = mount(<EventsList events={events} onEventClick={onButtonClick} />)
        // simulate a click
        wrapper.find('li').first().simulate('click')
        expect(onButtonClick.calledOnce).toBe(true)
    })
})
