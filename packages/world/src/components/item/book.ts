import { IntTag, ListTag, StringTag, Tag } from "@serenityjs/nbt";

import { BookPage } from "../../book";

import { ItemComponent } from "./item-component";

import type { Items } from "@serenityjs/item";
import type { ItemStack } from "../../item";

class ItemBookComponent<T extends keyof Items> extends ItemComponent<T> {
	public static readonly identifier = "minecraft:writtable_book";
	public pages: Array<BookPage> = [];

	// ? If book signed
	protected author?: string;
	protected title?: string;
	protected generation?: number;

	public constructor(item: ItemStack<T>) {
		super(item, ItemBookComponent.identifier);
	}

	/**
	 * Add's pages to the book
	 * @param pages The pages to add to the book
	 */
	public addPage(...pages: Array<BookPage>): void {
		this.pages.push(...pages);
	}

	/**
	 * Insert pages at a certain point of the book pages
	 * @param startingPageId The starting point to insert the pages
	 * @param pages The pages to insert
	 */

	public insertPage(startingPageId: number, ...pages: Array<BookPage>): void {
		if (!this.pages[startingPageId]) return;
		this.pages = [
			...this.pages.slice(0, startingPageId), // ? Get the items between start and insert point
			...pages, // ? Insert the new pages
			...this.pages.slice(startingPageId) // ? Get the items after insert point
		];
	}

	/**
	 * Swaps the content of two book pages
	 * @param pageId The first page identifier
	 * @param pageId2 The second page identifier
	 * @returns
	 */
	public swapPages(pageId: number, pageId2: number): void {
		// ? Get the desired pages
		const [page1, page2] = [pageId, pageId2].map(this.getPage.bind(this));

		if (!page1 || !page2) return;
	}

	/**
	 * Get's a book page
	 * @param pageId The page identifier to get the page
	 * @returns The Book page if found
	 */
	public getPage(pageId: number): BookPage | undefined {
		return this.pages[pageId];
	}

	/**
	 * Set's the text of a page
	 * @param pageId The page identifier to write the text
	 * @param pageText The page text to write
	 */
	public setPageText(pageId: number, pageText: string): void {
		if (!this.getPage(pageId)) return this.addPage(new BookPage(pageText));
		const page = this.getPage(pageId);

		// WTF ESlint
		if (page) page.text = pageText;
	}

	/**
	 * Delete's a book page
	 * @param pageId The page identifier to delete
	 */

	public deletePage(pageId: number): void {
		this.pages.splice(pageId, 1);
	}

	// TODO: Add the signed book data
	public write(): void {
		const tag = this.item.nbt;

		if (this.pages.length > 0) {
			// ? Write all the pages to the item nbt data
			tag.addTag(
				new ListTag(
					"pages",
					this.pages.map((page) => page.write()),
					Tag.Compound
				)
			);
		} else {
			tag.removeTag("pages");
		}
	}
}

export { ItemBookComponent };
