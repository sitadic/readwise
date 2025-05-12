"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const AUTHOR_DATA = [
  { id: 1077326, name: "J.K. Rowling" },
  { id: 3389, name: "Stephen King" },
  { id: 153394, name: "Suzanne Collins" },
  { id: 941441, name: "Stephenie Meyer" },
  { id: 656983, name: "J.R.R. Tolkien" },
  { id: 15872, name: "Rick Riordan" },
  { id: 2927, name: "Mary GrandPre" },
  { id: 630, name: "Dan Brown" },
  { id: 150038, name: "Cassandra Clare" },
  { id: 947, name: "William Shakespeare" },
  { id: 1406384, name: "John Green" },
  { id: 3780, name: "James Patterson" },
  { id: 1265, name: "Jane Austen" },
  { id: 2345, name: "Nicholas Sparks" },
  { id: 1069006, name: "C.S. Lewis" },
  { id: 3706, name: "George Orwell" },
  { id: 1221698, name: "Neil Gaiman" },
  { id: 4039811, name: "Veronica Roth" },
  { id: 346732, name: "George R.R. Martin" },
  { id: 1244, name: "Mark Twain" },
  { id: 721, name: "John Grisham" },
  { id: 1825, name: "Harper Lee" },
  { id: 706255, name: "Stieg Larsson" },
  { id: 1654, name: "Terry Pratchett" },
  { id: 625, name: "Nora Roberts" },
  { id: 3190, name: "F. Scott Fitzgerald" },
  { id: 569, name: "Khaled Hosseini" },
  { id: 7128, name: "Jodi Picoult" },
  { id: 585, name: "John Steinbeck" },
  { id: 17061, name: "Charlaine Harris" },
  { id: 2384, name: "Janet Evanovich" },
  { id: 4725841, name: "E.L. James" },
  { id: 6765, name: "Virginia Woolf" },
  { id: 137902, name: "Richelle Mead" },
  { id: 123715, name: "Agatha Christie" },
  { id: 239579, name: "Charles Dickens" },
  { id: 2383, name: "Gillian Flynn" },
  { id: 819789, name: "J.D. Salinger" },
  { id: 61105, name: "Dr. Seuss" },
  { id: 2565625, name: "Reg Keeland" },
  { id: 4273, name: "Roald Dahl" },
  { id: 3500, name: "Anna Quindlen" },
  { id: 146, name: "Quentin Blake" },
  { id: 566, name: "Paulo Coelho" },
  { id: 435477, name: "Shel Silverstein" },
  { id: 30916, name: "Garth Williams" },
  { id: 4, name: "Orson Scott Card" },
  { id: 6160, name: "Sophie Kinsella" },
  { id: 589, name: "Anne Frank" },
  { id: 3720, name: "Douglas Adams" },
  { id: 2493, name: "Lois Lowry" },
  { id: 38550, name: "Brandon Sanderson" },
  { id: 9355, name: "Dean Koontz" },
  { id: 44566, name: "Eleanor Roosevelt" },
  { id: 14116317, name: "B.M. Mooyaart-Doubleday" },
  { id: 2778055, name: "Kurt Vonnegut Jr." },
  { id: 5194, name: "Michael Crichton" },
  { id: 10746, name: "Jim Butcher" },
  { id: 8349, name: "Christopher Paolini" },
  { id: 44524, name: "P.C. Cast" },
  { id: 2022, name: "Robert Jordan" },
  { id: 10746, name: "Alice Sebold" },
  { id: 8349, name: "Philip Pullman" },
  { id: 2778055, name: "Kristin Cast" },
  { id: 5194, name: "Diana Gabaldon" },
  { id: 10746, name: "Ray Bradbury" },
  { id: 8349, name: "William Golding" },
  { id: 2778055, name: "Anne Rice" },
  { id: 5194, name: "Meg Cabot" },
  { id: 10746, name: "James Dashner" },
  { id: 8349, name: "Kathryn Stockett" },
  { id: 2778055, name: "Ernest Hemingway" },
  { id: 5194, name: "J.R. Ward" },
  { id: 10746, name: "Haruki Murakami" },
  { id: 8349, name: "Lemony Snicket" },
  { id: 2778055, name: "John Seelye" },
  { id: 5194, name: "Brett Helquist" },
  { id: 10746, name: "Guy Cardwell" },
  { id: 8349, name: "Margaret Atwood" },
  { id: 2778055, name: "Isaac Asimov" },
  { id: 5194, name: "Louisa May Alcott" },
  { id: 10746, name: "Kiera Cass" },
  { id: 8349, name: "Sarah J. Maas" },
  { id: 2778055, name: "Alan R. Clarke" },
  { id: 5194, name: "Laurell K. Hamilton" },
  { id: 10746, name: "Malcolm Gladwell" },
  { id: 8349, name: "Markus Zusak" },
  { id: 2778055, name: "David Sedaris" },
  { id: 5194, name: "Arthur Golden" },
  { id: 10746, name: "Elizabeth Gilbert" },
  { id: 8349, name: "Audrey Niffenegger" },
  { id: 2778055, name: "Arthur Conan Doyle" },
  { id: 5194, name: "Charlotte Bronte" },
  { id: 10746, name: "Jeffrey Eugenides" },
  { id: 8349, name: "Colleen Hoover" },
  { id: 2778055, name: "Mitch Albom" },
  { id: 5194, name: "Jennifer L. Armentrout" },
  { id: 10746, name: "Paula Hawkins" },
  { id: 8349, name: "Rainbow Rowell" },
  { id: 2778055, name: "Lee Child" },
];

interface RecommendationsStepProps {
  onNext: () => void;
  onBack: () => void;
  userData: { followedAuthors: string[] };
  onUpdate: (data: { followedAuthors: string[] }) => void;
}

export function RecommendationsStep({
  onNext,
  onBack,
  userData,
  onUpdate,
}: RecommendationsStepProps) {
  const toggleAuthor = (authorId: string) => {
    const newFollowed = userData.followedAuthors.includes(authorId)
      ? userData.followedAuthors.filter((id) => id !== authorId)
      : [...userData.followedAuthors, authorId];
    onUpdate({ followedAuthors: newFollowed });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Follow some authors</h2>
        <p className="text-muted-foreground">
          Follow authors to see their book recommendations and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
        {AUTHOR_DATA.map((author) => (
          <div
            key={author.id}
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-all duration-200"
            onClick={() => toggleAuthor(author.id.toString())}
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{author.name}</h3>
              <p className="text-sm text-muted-foreground">Genre</p>
            </div>
            {userData.followedAuthors.includes(author.id.toString()) && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}