/*
 * @Author: Turump 
 * @Date: 2021-03-29 15:46:48 
 * @Last Modified by: Turump
 * @Last Modified time: 2021-03-31 10:54:27
 * 事件观察中心
 */

import { Component } from "cc";

/** 订阅 */
interface Subscription {
    callback: Function;
    target: any;
}

export default class EventCenter {
    private static events: Map<string, Subscription[]> = new Map<string, Subscription[]>();

    private static onceEvents: Map<string, Subscription[]> = new Map<string, Subscription[]>();


    /**
     * 监听事件
     * @param name 事件名
     * @param callback 回调
     * @param target 订阅对象
     */
    public static on(name: string, callback: Function, target?: any) {
        if (!this.events.has(name)) {
            this.events.set(name, []);
        }
        this.events.get(name).push({ callback, target });
    }

    /**
     * 监听事件（一次性）
     * @param name 事件名
     * @param callback 回调
     * @param target 订阅对象
     */
    public static once(name: string, callback: Function, target?: any) {
        if (!this.onceEvents.has(name)) {
            this.onceEvents.set(name, []);
        }
        this.onceEvents.get(name).push({ callback, target });
    }

    /**
     * 取消监听事件
     * @param name 事件名
     * @param callback 回调
     * @param target 订阅对象
     */
    public static off(name: string, callback: Function, target?: any) {
        if (this.events.has(name)) {
            const subscriptions = this.events.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].target === target &&
                    (subscriptions[i].callback === callback || subscriptions[i].callback.toString() === callback.toString())) {
                    subscriptions.splice(i, 1);
                    break;
                }
            }
        }
        // 一次性事件
        if (this.onceEvents.has(name)) {
            const subscriptions = this.onceEvents.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].target === target &&
                    (subscriptions[i].callback === callback || subscriptions[i].callback.toString() === callback.toString())) {
                    subscriptions.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * 发射事件
     * @param name 事件名
     * @param args 参数
     */
    public static emit(name: string, ...args: any[]) {
        // cc.log(`EventCenter emit event: ${name}`,  args.toString())
        if (this.events.has(name)) {
            let invalidSubscriptorsIndex = [];
            const subscriptions = this.events.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                if(subscriptions[i].target instanceof Component && (subscriptions[i].target as Component).isValid == false) {
                    invalidSubscriptorsIndex.push(i);
                    continue;
                }
                subscriptions[i].callback.apply(subscriptions[i].target, args);
            }
            //delete invalid target
            for(let i = invalidSubscriptorsIndex.length - 1; i >= 0; i--) {
                subscriptions.splice(invalidSubscriptorsIndex[i], 1);
            }
        }
        
        // 一次性事件
        if (this.onceEvents.has(name)) {
            let subscriptions = this.onceEvents.get(name);
            for (let i = 0; i < subscriptions.length; i++) {
                if(subscriptions[i].target instanceof Component && (subscriptions[i].target as Component).isValid == false) {
                    continue;
                }
                subscriptions[i].callback.apply(subscriptions[i].target, args);
            }
            subscriptions.length = 0;
        }
    }

    /**
     * 移除事件
     * @param name 事件名
     */
    public static remove(name: string) {
        if (this.events.has(name)) {
            this.events.delete(name);
        }
        if (this.onceEvents.has(name)) {
            this.onceEvents.delete(name);
        }
    }

    /**
     * 移除所有事件
     */
    public static removeAll() {
        this.events.clear();
        this.onceEvents.clear();
    }

    public static removeComponentInvalid() {

    }
}
