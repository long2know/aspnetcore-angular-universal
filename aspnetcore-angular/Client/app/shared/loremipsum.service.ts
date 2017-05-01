import { Injectable } from '@angular/core';

// Ported over to TypeScript by Stephen Long

/**
 * @fileOverview Generates "Lorem ipsum" style text.
 * @author rviscomi@gmail.com Rick Viscomi,
 * 		tinsley@tinsology.net Mathew Tinsley
 * @version 1.0
 */

/**
 *	Copyright (c) 2009, Mathew Tinsley (tinsley@tinsology.net)
 *	All rights reserved.
 *
 *	Redistribution and use in source and binary forms, with or without
 *	modification, are permitted provided that the following conditions are met:
 *		* Redistributions of source code must retain the above copyright
 *		  notice, this list of conditions and the following disclaimer.
 *		* Redistributions in binary form must reproduce the above copyright
 *		  notice, this list of conditions and the following disclaimer in the
 *		  documentation and/or other materials provided with the distribution.
 *		* Neither the name of the organization nor the
 *		  names of its contributors may be used to endorse or promote products
 *		  derived from this software without specific prior written permission.
 *
 *	THIS SOFTWARE IS PROVIDED BY MATHEW TINSLEY ''AS IS'' AND ANY
 *	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *	DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
 *	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *	ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

@Injectable()
export class LoremIpsumService {
    readonly WORDS_PER_SENTENCE_AVG: number = 24.460;
    readonly WORDS_PER_SENTENCE_STD: number = 5.080;
    readonly WORDS: Array<string> = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
        'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
        'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
        'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
        'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis',
        'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
        'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
        'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
        'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
        'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
        'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in',
        'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',
        'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis',
        'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
        'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam',
        'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',
        'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',
        'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',
        'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',
        'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
        'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra',
        'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',
        'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',
        'morbi', 'pellentesque', 'metus', 'commodo', 'ut', 'facilisis',
        'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',
        'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',
        'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'mi',
        'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',
        'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',
        'elementum', 'tempor', 'risus', 'cras'
    ];

    constructor() {
    }

    /**
    * Generate a single "Lorem ipsum" style word.
    * @return {string} "Lorem ipsum..."
    */
    public singleWord(): string {
        var position = Math.floor(Math.random() * this.WORDS.length);
        var word = this.WORDS[position];
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    /**
    * Generate "Lorem ipsum" style words.
    * @param num_words {number} Number of words to generate.
    * @return {string} "Lorem ipsum..."
    */
    public generate(num_words: number): string {
        var words: Array<string>, ii: number, position, word: string, current: number, sentences, sentence_length, sentence;

        /**
         * @default 100
         */
        num_words = num_words || 100;

        words = [this.WORDS[0], this.WORDS[1]];
        num_words -= 2;

        for (ii = 0; ii < num_words; ii++) {
            position = Math.floor(Math.random() * this.WORDS.length);
            word = this.WORDS[position];

            if (ii > 0 && words[ii - 1] === word) {
                ii -= 1;

            } else {
                words[ii] = word;
            }
        }

        sentences = [];
        current = 0;

        while (num_words > 0) {
            sentence_length = this.getRandomSentenceLength();

            if (num_words - sentence_length < 4) {
                sentence_length = num_words;
            }

            num_words -= sentence_length;

            sentence = [];

            for (ii = current; ii < (current + sentence_length); ii++) {
                sentence.push(words[ii]);
            }

            sentence = this.punctuate(sentence);
            current += sentence_length;
            sentences.push(sentence.join(' '));
        }

        return sentences.join(' ');
    };

    /**
    * Insert commas and periods in the given sentence.
    * @param {Array.string} sentence List of words in the sentence.
    * @return {Array.string} Sentence with punctuation added.
    */
    public punctuate = function (sentence: Array<string>): Array<string> {
        var word_length: number, num_commas: number, ii: number, position: number;

        word_length = sentence.length;

        /* End the sentence with a period. */
        sentence[word_length - 1] += '.';

        if (word_length < 4) {
            return sentence;
        }

        num_commas = this.getRandomCommaCount(word_length);

        for (ii = 0; ii <= num_commas; ii++) {
            position = Math.round(ii * word_length / (num_commas + 1));

            if (position < (word_length - 1) && position > 0) {
                /* Add the comma. */
                sentence[position] += ',';
            }
        }

        /* Capitalize the first word in the sentence. */
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        return sentence;
    };

    /**
    * Produces a random number of commas.
    * @param {number} word_length Number of words in the sentence.
    * @return {number} Random number of commas
    */
    public getRandomCommaCount = function (word_length: number): number {
        var base, average, standard_deviation;

        /* Arbitrary. */
        base = 6;

        average = Math.log(word_length) / Math.log(base);
        standard_deviation = average / base;

        return Math.round(this.gaussMS(average, standard_deviation));
    };

    /**
     * Produces a random sentence length based on the average word length
     * of an English sentence.
     * @return {number} Random sentence length
     */
    public getRandomSentenceLength(): number {
        return Math.round(
            this.gaussMS(
                this.WORDS_PER_SENTENCE_AVG,
                this.WORDS_PER_SENTENCE_STD
            )
        );
    };

    /**
     * Produces a random number.
     * @return {number} Random number
     */
    gauss = function (): number {
        return (Math.random() * 2 - 1) +
            (Math.random() * 2 - 1) +
            (Math.random() * 2 - 1);
    };

    /**
     * Produces a random number with Gaussian distribution.
     * @param {number} mean
     * @param {number} standard_deviation
     * @return {number} Random number
     */
    gaussMS = function (mean: number, standard_deviation: number): number {
        return Math.round(this.gauss() * standard_deviation + mean);
    };
}