import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, closeModal, setStory} from "./js/store/router/actions";
import * as VK from './js/services/VK';

import { View,Epic,ConfigProvider,Panel,Tabbar,ModalRoot,TabbarItem, PanelHeader, Group,  Cell, FormLayout, FormLayoutGroup, Input,Footer,Avatar,HorizontalScroll} from '@vkontakte/vkui';

import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Poll from '@vkontakte/icons/dist/24/poll';
import Icon24Help from '@vkontakte/icons/dist/24/help';
import Icon24Home from '@vkontakte/icons/dist/24/home';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
      			showImg: false,
            activeStory:'main',
            nothing_about:'BMX',
            ur_param:''
      	};

        this.onStoryChange = this.onStoryChange.bind(this);

        this.lastAndroidBackAction = 0;
    }

    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }

    onValueChange = e =>{
        const {name,value} = e.currentTarget;
        this.setState({[name]:value});
        console.log(value);
    }

    componentWillUnmount() {
        const {setScrollPositionByID} = this.props;

        setScrollPositionByID("EXAMPLE_TABS_LIST");
    }

    componentDidMount() {
        const {goBack, dispatch} = this.props;

        dispatch(VK.initApp());

        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - this.lastAndroidBackAction > 500) {
                this.lastAndroidBackAction = timeNow;

                goBack('Android');
            } else {
                window.history.pushState(null, null);
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {activeView, activeStory, activePanel, scrollPosition} = this.props;

        if (
            prevProps.activeView !== activeView ||
            prevProps.activePanel !== activePanel ||
            prevProps.activeStory !== activeStory
        ) {
            let pageScrollPosition = scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;

            window.scroll(0, pageScrollPosition);
        }
    }

    render() {
        const {goBack, setStory, closeModal, popouts, activeView, activeStory, activePanel, activeModals, panelsHistory, colorScheme} = this.props;

        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];
        let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];


        return (
          <Epic activeStory={this.state.activeStory} tabbar={
  					<Tabbar>
  						<TabbarItem
  							onClick={this.onStoryChange}
  							selected={this.state.activeStory==='main'}
  							data-story="main"
  							text="Главная">
  						<Icon24Home/></TabbarItem>
  						<TabbarItem
  							onClick={this.onStoryChange}
  							selected={this.state.activeStory==='my_choose'}
  							data-story="my_choose"
  							text="Для меня">
  						<Icon24Poll /></TabbarItem>
  						<TabbarItem
  							onClick={this.onStoryChange}
  							selected={this.state.activeStory==='settings'}
  							data-story="settings"
  							text="Настройки">
  						<Icon24Help /></TabbarItem>
  						</Tabbar>
  					}>

  				<View id ="main" activePanel="main">
  					<Panel id ="main">
  						<PanelHeader>BMX|MTB Kaliningrad</PanelHeader>
  							<Group title="Недавние публикации">
  								<HorizontalScroll id="EXAMPLE_TABS_LIST">
  										<div style={{ display: 'flex' }} >
  											<img style={img_block} alt="" src={'https://sun9-32.userapi.com/c857416/v857416518/112273/9OFW9A7PzV4.jpg'}></img>
  											<div>
  												<Avatar size={32} style={{ marginBottom: 8 }}><Icon24User /></Avatar>
  												<Cell>Степан Федорович </Cell>
  											</div>
  									 </div>
  							</HorizontalScroll>
  						 </Group>
  						</Panel>
  						<Footer>Создано при поддержке сообщества BMX|MTB Kaliningrad</Footer>
  					</View>
  				<View id="my_choose" activePanel="my_choose">
  					<Panel id="my_choose">
              <PanelHeader>BMX|MTB Kaliningrad</PanelHeader>
    						<FormLayout>
    							<FormLayoutGroup top="Ваш текст">
    								<Input type="text" defaultValue="nasnfsadmfa'mfdp'bug" ref={this.state.nothing_about} onValueChange={this.onValueChange} name = "title"/>
    							</FormLayoutGroup>
    						</FormLayout>
  					</Panel>
  				</View>
  				<View id="settings" activePanel="settings">
  					<Panel id="settings">
              <PanelHeader>BMX|MTB Kaliningrad</PanelHeader>
                <Cell>{this.state.nothing_about}</Cell>
  					</Panel>
  				</View>
  			</Epic>
        )
    }
}

const img_block = {
	 height:80,
	 width:80,
	 borderColor:'grey',
	 borderWidth:'3px'
};

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activePanel: state.router.activePanel,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,
        scrollPosition: state.router.scrollPosition,

        colorScheme: state.vkui.colorScheme
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({setStory, goBack, closeModal}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
