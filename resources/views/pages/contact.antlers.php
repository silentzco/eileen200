


<div class="prose prose-xl mx-auto py-12">



    <h1 class="my-4 text-primary">{{ title }}</h1>

    <div class="my-4">



        {{ form:contact_us id="contact-form" }}


            {{ if success }}
            <div class="bg-green-300 text-white p-2">
                {{ success }}
            </div>
            {{ else }}

            {{ if errors }}
            <div class="bg-red-300 text-white p-2">
                {{ errors }}
                {{ value }}<br>
                {{ /errors }}
            </div>
            {{ /if }}

            {{ fields }}
            <div class="p-2">
                <label class="font-bold">{{ display }}</label>
                <div class="p-1">
                    {{ field }}
                    <span class="text-sm text-gray-500">{{ instructions }}</span>
                </div>

                {{ if error }}
                <p class="text-gray-500">{{ error }}</p>
                {{ /if }}
            </div>
            {{ /fields }}

            <button type="submit" class="block mx-auto bg-brand hover:bg-brand text-white rounded-lg font-bold py-2 px-20 text-lg ">Submit</button>
            {{ /if }}

        {{ /form:contact_us }}


        {{ content }}

    </div>




</div>

