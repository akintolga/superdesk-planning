import React from 'react'
import { mount } from 'enzyme'
import AddEventContainer, { AddEvent } from '../AddEventContainer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import planningApp from '../../reducers'
import * as actions from '../../actions'

describe('<AddEventContainer />', () => {
    it('open the modal', () => {
        let store = createStore(planningApp, {})
        const wrapper = mount(<Provider store={store}><AddEventContainer /></Provider>)
        expect(wrapper.find(AddEvent).props().show).toBe(false)
        store.dispatch(actions.showModal({ modalType: 'EDIT_EVENT', modalProps: { event: {} } }))
        expect(wrapper.find(AddEvent).props().show).toBe(true)
    })
})
