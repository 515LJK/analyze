import popContructor from '../pop';
import utils from 'common/util';

let instance;
let instances = [];
let seed = 1;

const register = {
    install: (Vue)=> {
        if (Vue === undefined && typeof window !== 'undefined' && window.vue ) {
            Vue = window.vue;
        };

        function Popup(options) {
            let optionsType = utils.type(options);
            let propData = options || {};

            if (typeof options === 'string') {
                propData = {
                    message: options
                };
            };

            let onClose = propData.onClose;
            let id = seed++;

            propData.onClose = function() {
                Popup.close(id, onClose);
            };

            instance = new popContructor({
                propsData: propData
            }).$mount();
            let el = instance.$el;
            let $app = document.getElementById('app');
            $app.appendChild(el);
            instance.isShow = true;
            instance._popId = id;
            instances.push(instance);
            return instance;
        };

        Popup.close = function(id, onClose) {
            let index = instances.findIndex(val=>val._popId === id);
            if (index === -1) return;
            if (typeof onClose === 'function') {
                onClose(instances[index]);
            };
            instances.splice(index, 1);
        };

        Popup.closeAll = function() {
            let len = instances.length;
            for (let i= len - 1; i >= 0; i--) {
                instances[i].close();
            };
        };

        Vue.prototype.$pop = Popup;
    }
}

export default register;