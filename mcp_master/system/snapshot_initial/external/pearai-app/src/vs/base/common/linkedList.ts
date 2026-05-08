/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class Node_v2<E> {

	static readonly Undefined = new Node_v2<any>(undefined);

	element: E;
	next: Node_v2<E>;
	prev: Node_v2<E>;

	constructor(element: E) {
		this.element = element;
		this.next = Node_v2.Undefined;
		this.prev = Node_v2.Undefined;
	}
}

export class LinkedList<E> {

	private _first: Node_v2<E> = Node_v2.Undefined;
	private _last: Node_v2<E> = Node_v2.Undefined;
	private _size: number = 0;

	get size(): number {
		return this._size;
	}

	isEmpty(): boolean {
		return this._first === Node_v2.Undefined;
	}

	clear(): void {
		let node = this._first;
		while (node !== Node_v2.Undefined) {
			const next = node.next;
			node.prev = Node_v2.Undefined;
			node.next = Node_v2.Undefined;
			node = next;
		}

		this._first = Node_v2.Undefined;
		this._last = Node_v2.Undefined;
		this._size = 0;
	}

	unshift(element: E): () => void {
		return this._insert(element, false);
	}

	push(element: E): () => void {
		return this._insert(element, true);
	}

	private _insert(element: E, atTheEnd: boolean): () => void {
		const newNode = new Node_v2(element);
		if (this._first === Node_v2.Undefined) {
			this._first = newNode;
			this._last = newNode;

		} else if (atTheEnd) {
			// push
			const oldLast = this._last;
			this._last = newNode;
			newNode.prev = oldLast;
			oldLast.next = newNode;

		} else {
			// unshift
			const oldFirst = this._first;
			this._first = newNode;
			newNode.next = oldFirst;
			oldFirst.prev = newNode;
		}
		this._size += 1;

		let didRemove = false;
		return () => {
			if (!didRemove) {
				didRemove = true;
				this._remove(newNode);
			}
		};
	}

	shift(): E | undefined {
		if (this._first === Node_v2.Undefined) {
			return undefined;
		} else {
			const res = this._first.element;
			this._remove(this._first);
			return res;
		}
	}

	pop(): E | undefined {
		if (this._last === Node_v2.Undefined) {
			return undefined;
		} else {
			const res = this._last.element;
			this._remove(this._last);
			return res;
		}
	}

	private _remove(node: Node_v2<E>): void {
		if (node.prev !== Node_v2.Undefined && node.next !== Node_v2.Undefined) {
			// middle
			const anchor = node.prev;
			anchor.next = node.next;
			node.next.prev = anchor;

		} else if (node.prev === Node_v2.Undefined && node.next === Node_v2.Undefined) {
			// only node
			this._first = Node_v2.Undefined;
			this._last = Node_v2.Undefined;

		} else if (node.next === Node_v2.Undefined) {
			// last
			this._last = this._last.prev!;
			this._last.next = Node_v2.Undefined;

		} else if (node.prev === Node_v2.Undefined) {
			// first
			this._first = this._first.next!;
			this._first.prev = Node_v2.Undefined;
		}

		// done
		this._size -= 1;
	}

	*[Symbol.iterator](): Iterator<E> {
		let node = this._first;
		while (node !== Node_v2.Undefined) {
			yield node.element;
			node = node.next;
		}
	}
}
