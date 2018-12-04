import {HtmlElementUtility} from "./html-element-utility";
import {OnReady} from "../interfaces/on-ready.interface";
import {ComponentRegistry} from "./component.registry";
import {Template} from "../classes/template";
import {DomReady} from "./dom-ready";
import {AbstractComponent} from "../classes/abstract.component";

/**
 * @description
 * The component Factory is used to bootstrap all Components.
 * Components can also be created on runtime with this factory
 */
export abstract class ComponentFactory {

	/**
	 * @description
	 * Registers all Components passed as array. The Class should be passed, not the object!
	 * @param {*[]} components
	 */
	public static registerComponents(components: any[]): void {
		DomReady.ready(() => {
			for (let i = 0, l = components.length; i < l; i++) {
				const componentClass = this.createComponentClass(components[i]);
				const elements = HtmlElementUtility.querySelectAllByAttribute(componentClass.__options.selector);
				for (let j = 0, m = elements.length; j < m; j++) {
					this.initializeComponent(this.createComponentClass(components[i]), elements[j]);
				}
			}
		});
	}

	/**
	 * @description
	 * You can register a listener, which gets called if the passed component gets initialized.
	 * Normally used by Decorators to add features to components
	 * @param callback
	 * @param individualComponent
	 */
	public static onComponentClassInitialized(callback: (componentObject?: AbstractComponent) => void, individualComponent: AbstractComponent): void {
		if (typeof individualComponent.__componentClassInitializedListeners === 'undefined') {
			individualComponent.__componentClassInitializedListeners = [];
		}
		individualComponent.__componentClassInitializedListeners.push(callback);
	}

	/**
	 * @description
	 * Calls the initialize listener of the passed component object (like the name says)
	 * @param {AbstractComponent} individualComponent
	 */
	private static callComponentClassInitialized(individualComponent: AbstractComponent): void {
		if (typeof individualComponent.__componentClassInitializedListeners === 'undefined') {
			return;
		}
		for (let i = 0, l = individualComponent.__componentClassInitializedListeners.length; i < l; i++) {
			individualComponent.__componentClassInitializedListeners[i](individualComponent);
		}
	}

	/**
	 * @description
	 * Returns an instance of the passed component class which is then being casted to the AbstractComponent for internal reasons.
	 * @param componentClass
	 * @return {AbstractComponent}
	 */
	private static createComponentClass(componentClass: any): AbstractComponent {
		return new componentClass() as AbstractComponent;
	}

	/**
	 * @description
	 * This method does the main work of component creation.
	 * it ...
	 * - ... searches for a matching template
	 * - ... initializes all children
	 * - ... calls all initialize listeners
	 * - ... calls all ready listeners
	 * - and registers the component object in the registry
	 * @param {AbstractComponent} individualComponent
	 * @param {HTMLElement} element
	 */
	private static initializeComponent(individualComponent: AbstractComponent, element: Element): AbstractComponent {
		individualComponent.element = element;
		individualComponent.selector = individualComponent.__options.selector;
		if (typeof individualComponent.__options.template === 'string') {
			const templateElement = document.getElementById(individualComponent.__options.template) as HTMLTemplateElement;
			if (typeof templateElement.innerHTML !== 'undefined') {//we no longer check the instance of, because of some polyfills that cant inherit from the HTMLTemplateElement
				individualComponent.template = new Template(templateElement.innerHTML);
			}
		}

		if (individualComponent.__options.childrenSelectors && individualComponent.__options.childrenSelectors.length) {
			this.initializeChildrenElements(individualComponent, individualComponent.__options);
		}
		this.callComponentClassInitialized(individualComponent);
		this.callReadyListener(individualComponent);
		if (individualComponent.__options.selector) {
			ComponentRegistry.registerComponent(individualComponent.__options.selector, individualComponent);
		}
		return individualComponent;
	}

	/**
	 * @description
	 * You can create component objects on the fly with this method.
	 * Lets say you have an HTML response of any given ajax request and you want to bootstrap the components defined there.
	 * Just call this method with a: the HTML element of the selector and b: the correct component class.
	 * @param {HTMLElement} element
	 * @param componentClass
	 */
	public static createComponentWithElement(element: HTMLElement, componentClass: AbstractComponent): AbstractComponent {
		return this.initializeComponent(this.createComponentClass(componentClass), element);
	}

	/**
	 * @description
	 * Searches for children registered via Component Decorator
	 * @param {AbstractComponent} individualComponent
	 * @param options todo: add definition for options
	 */
	private static initializeChildrenElements(individualComponent: AbstractComponent, options: any): void {
		for (let j = 0; j < options.childrenSelectors.length; j++) {
			const childrenElements = HtmlElementUtility.querySelectAllByAttribute(options.childrenSelectors[j], individualComponent.element);
			if (typeof individualComponent.children === "undefined") {
				individualComponent.children = {};
			}
			individualComponent.children[options.childrenSelectors[j]] = childrenElements;
		}
	}

	/**
	 * @description
	 * Calls the onReady listener if the class of the component object implemented the OnReady Interface
	 * @param {AbstractComponent} individualComponent
	 */
	private static callReadyListener(individualComponent: AbstractComponent): void {
		let onReadyCasted = individualComponent as {} as OnReady;
		if ('onReady' in individualComponent && typeof onReadyCasted.onReady === 'function') {
			onReadyCasted.onReady();
		}
	}
}