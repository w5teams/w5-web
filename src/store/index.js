import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state={
    collapsed: false,
    theme: "blue"
};

const mutations={ 
    openCollapsed(state){  
        state.collapsed = false; 
    },
    closeCollapsed(state){  
        state.collapsed = true; 
    },
    setTheme(state,theme){  
        state.theme = theme
    }
}

const getters={
    getCollapsed(){
        return state.collapsed;
    },
    getTheme(){
        return state.theme;
    } 
}

const store = new Vuex.Store({
    state,
    getters,
    mutations
});

export default store;