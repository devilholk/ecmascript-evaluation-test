const void_elements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

class HTMLElement {
	constructor(tag, attributes, children) {
		this.tag = tag;
		this.parent = undefined;
		if (attributes !== undefined) {
			this.attributes = attributes;
		} else {
			this.attributes = {};
		}
		if (children !== undefined) {
			this.children = children;
		} else {
			this.children = [];
		}		
	}

	appendChild(child) {
		this.children.push(child);
		child.parent = this;
	}


	bodyToHTML(pretty_print) {
		var body = '';
		for (const child of this.children) {
			body += child.toHTML(pretty_print);
		}
		return body;
	}

	toHTML(pretty_print) {		
		if (pretty_print) {
			return 'NOTIMPLEMENTED'
		} else {

			var body = this.bodyToHTML(pretty_print);
			var attrs = '';
			for (const key in this.attributes) {
				attrs += ` ${key}=${this.attributes[key]}`;
			}

			if (void_elements.has(this.tag)) {
				return `<${this.tag}${attrs}>`;
			} else {
				return `<${this.tag}${attrs}>${body}</${this.tag}>`;
			}
		}
		
	}
}


class HTMLTextNode {
	constructor(text) {
		this.text = text;
		this.parent = undefined;
	}
}
